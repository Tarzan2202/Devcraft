import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    
    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'ไม่พบข้อความใน Request' }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1].content;
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    let searchError = null;

   // 1. Generate embedding 3072 dimensions (เพื่อให้ตรงกับข้อมูลเดิมใน DB)
    let queryVector: number[] = [];
    try {
      if (!apiKey) throw new Error('Missing GOOGLE_GENERATIVE_AI_API_KEY');
      const EMBED_MODEL = 'gemini-embedding-001';
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${EMBED_MODEL}:embedContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: `models/${EMBED_MODEL}`, 
            content: { parts: [{ text: lastMessage }] }, 
            outputDimensionality: 3072
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Google API status ${response.status}: ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      if (data.embedding?.values) {
        queryVector = data.embedding.values;
      } else {
        throw new Error('โครงสร้างค่ายกกำลังเวกเตอร์ไม่ถูกต้อง');
      }
    } catch (err: any) {
      console.error('Embedding Generation Error:', err.message);
      searchError = `Embedding Error: ${err.message}`;
    }
    // 2. ค้นหาคลังความรู้จาก MongoDB Atlas
    let searchResults: Array<{ title: string; content: string; score?: number }> = [];
    try {
      if (queryVector.length > 0) {
        const db = await getDb();
        const collection = db.collection('knowledge');

        // ใช้การระบุประเภทผลลัพธ์ที่ปลายทางร่วมด้วย (Optional แต่แนะนำ)
        searchResults = await collection.aggregate<{ title: string; content: string; score: number }>([
          {
            $vectorSearch: {
              index: "vector_index", 
              path: "embedding",     
              queryVector: queryVector,
              numCandidates: 100,
              limit: 5,
            },
          },
          {
            $project: {
              _id: 0,
              title: 1,
              content: 1,
              score: { $meta: "vectorSearchScore" }
            }
          }
        ]).toArray();
      }
    } catch (err: any) {
      console.error('MongoDB Vector Search Error:', err.message);
      searchError = err.message;
    }
    
    const context = searchResults.length > 0 
      ? searchResults.map(res => `[${res.title}]: ${res.content}`).join('\n\n')
      : "ไม่พบข้อมูลที่เกี่ยวข้องในฐานข้อมูลความรู้";

    // 3. ปรับโครงสร้างประวัติการสนทนา (แก้ไข: บังคับให้ข้อความแรกต้องเป็น 'user' เท่านั้นตามกฎของ SDK)
    let formattedHistory = messages.slice(0, -1).map((msg: any) => ({
      role: msg.role === 'assistant' || msg.role === 'bot' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    // กรองประวัติ: หากข้อความแรกสุดดันเริ่มต้นด้วยบทบาท 'model' ให้ตัดทิ้ง เพื่อป้องกันข้อผิดพลาดจาก Gemini SDK
    if (formattedHistory.length > 0 && formattedHistory[0].role === 'model') {
      formattedHistory.shift(); 
    }

    // 4. เรียกใช้โมเดล Gen คำตอบ
    try {
      const chatModel = genAI.getGenerativeModel({ 
        model: "gemini-3.1-flash-lite", 
        systemInstruction: `คุณคือผู้ช่วย AI ส่วนตัวของ พีราวิชญ์ (เจ้าของ Portfolio นี้) 
        ใช้ข้อมูลต่อไปนี้เพื่อตอบคำถามผู้เยี่ยมชมอย่างสุภาพ เป็นกันเอง และเป็นมืออาชีพ 

        กติกาการตอบ (สำคัญมาก):
        1. ให้ตอบเฉพาะคำถามที่เกี่ยวกับ พีราวิชญ์, ผลงาน, ประวัติ, ทักษะ หรือข้อมูลที่ระบุไว้ในบริบท (Context) เท่านั้น
        2. หากผู้ใช้ถามคำถามทั่วไป นอกเหนือเรื่องราวของพีราวิชญ์ หรือเรื่องที่ไม่เกี่ยวข้องกับพอร์ตโฟลิโอนี้ (เช่น ข่าวสาร, การเมือง, สูตรอาหาร, โค้ดโปรแกรมทั่วไปที่ไม่เกี่ยวข้องกัน) ให้ปฏิเสธการตอบอย่างสุภาพ เช่น "ขออภัยด้วยครับ ผมเป็นผู้ช่วย AI ของคุณพีราวิชญ์ จึงสามารถให้ข้อมูลได้เฉพาะส่วนที่เกี่ยวข้องกับคุณพีราวิชญ์และผลงานเท่านั้นครับ"
        3. ถ้ามีข้อมูลในบริบท (Context) ให้ใช้ข้อมูลนั้นตอบเป็นหลัก
        4. หากเป็นเรื่องเกี่ยวกับพีราวิชญ์แต่ในบริบท (Context) ไม่มีข้อมูล ให้แจ้งผู้ใช้ทราบว่าไม่มีข้อมูลนี้ในพอร์ตโฟลิโอโดยตรง

        บริบทจากฐานข้อมูล (Context):
        ${context}

        สถานะระบบค้นหาข้อมูล: ${searchError ? 'พบบั๊กชั่วคราว: ' + searchError : 'ปกติ'}`
      });

      const chat = chatModel.startChat({ history: formattedHistory });
      const result = await chat.sendMessage(lastMessage);
      const responseText = result.response.text();

      return NextResponse.json({ role: 'bot', content: responseText });
    } catch (err: any) {
      console.error('Gemini Chat Error:', err);
      return NextResponse.json({ error: 'Gemini ไม่สามารถสร้างคำตอบได้', details: err.message }, { status: 500 });
    }

  } catch (error: any) {
    console.error('System Failure:', error);
    return NextResponse.json({ error: 'ระบบภายในขัดข้องชั่วคราว', details: error.message }, { status: 500 });
  }
}
