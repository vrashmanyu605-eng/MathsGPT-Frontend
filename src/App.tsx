import { useState } from 'react';
import axios from 'axios';
import { Header } from './components/Header';
import { InputSection } from './components/InputSection';
import { ChatComponent } from './components/ChatComponent';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);


  // API Configuration
  const API_BASE_URL = 'http://192.168.0.134:5500'; // using Vite proxy to avoid CORS

  const handleAnalyze = async (type: 'youtube' | 'pdf', content: string | File) => {
    setIsAnalyzing(true);
    try {
      if (type === 'youtube' && typeof content === 'string') {
        await axios.post(`${API_BASE_URL}/uploadURL`, {
          url: content
        });
        
        setMessages([
          { 
            role: 'assistant', 
            content: `I have analyzed the video. I am ready to answer your questions regarding the content!` 
          }
        ]);
      } else if (type === 'pdf' && content instanceof File) {
        const formData = new FormData();
        formData.append('file', content);
        
        await axios.post(`${API_BASE_URL}/uploadPDF`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        setMessages([
          { 
            role: 'assistant', 
            content: `I have received and analyzed the document **"${content.name}"**. I am ready to answer your questions regarding the content!` 
          }
        ]);
      } else {
        console.warn("Invalid content type for analysis");
      }
    } catch (error) {
      console.error("Analysis Error", error);
       setMessages(prev => [
            ...prev, 
            { role: 'assistant', content: "Sorry, I encountered an error analyzing the content. Please ensure the backend is running." }
       ]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSend = async (message: string, file: File | null) => {
    // Add user message immediately
    const userMessage = file 
        ? `${message}\n\n*[Attached Image: ${file.name}]*` 
        : message;
    
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsChatLoading(true);

    try {
      const formData = new FormData();
      formData.append('userQuery', message);
      if (file) {
        formData.append('file', file);
      }

      const response = await axios.post(`${API_BASE_URL}/generateAnswer`, formData, {
         headers: {
            'Content-Type': 'multipart/form-data'
         }
      });

      // Assuming the API returns the markdown string directly in response.data or response.data.answer
      // Adjust based on actual API response structure. 
      // If response.data is the string:
      const answer = typeof response.data === 'string' ? response.data : 
                     (response.data.answer || response.data.content || JSON.stringify(response.data));

      setIsChatLoading(false);
             
      // Start streaming effect for the received answer
      setMessages(prev => [...prev, { role: 'assistant', content: "" }]);
      
      let i = 0;
      const streamingInterval = setInterval(() => {
        if (i >= answer.length) {
            clearInterval(streamingInterval);
            return;
        }
        const char = answer[i];
        setMessages(prev => {
            const newMsgs = [...prev];
            const lastMsg = { ...newMsgs[newMsgs.length - 1] };
            lastMsg.content += char;
            newMsgs[newMsgs.length - 1] = lastMsg;
            return newMsgs;
        });
        i++;
      }, 10); // Fast typing effect

    } catch (error) {
        console.error("API Error", error);
        setIsChatLoading(false);
        setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I couldn't generate an answer at this time." }]);
    }
  };

  return (
    <div className="min-h-screen bg-background text-white font-sans selection:bg-primary/30 relative overflow-hidden">
        {/* Background Effects */}
        <div className="fixed inset-0 z-0">
             <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
             <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary opacity-20 blur-[100px]"></div>
             <div className="absolute right-0 bottom-0 -z-10 h-[310px] w-[310px] rounded-full bg-secondary opacity-20 blur-[100px]"></div>
        </div>

        <div className="relative z-10 flex flex-col h-screen">
          <Header />
          
          <main className="flex-1 p-4 md:p-6 flex flex-col lg:flex-row gap-6 overflow-hidden max-w-[1920px] mx-auto w-full">
            {/* Left Section - Input */}
            <section className="w-full lg:w-[400px] xl:w-[450px] flex-shrink-0 flex flex-col h-fit lg:h-full max-h-[400px] lg:max-h-full">
               <InputSection onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
            </section>
            
            {/* Right Section - Chat */}
            <section className="flex-1 h-full min-h-0 w-full">
               <ChatComponent 
                 messages={messages} 
                 isLoading={isChatLoading} 
                 onSend={handleSend} 
               />
            </section>
          </main>
        </div>
    </div>
  );
}

export default App;
