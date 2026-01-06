import React, { useState } from 'react';
import { Mail, Star, Trash2, Send, Sparkles, Loader2, ChevronRight } from 'lucide-react';
import { Email } from '../types.ts';
import { generateEmailDraft } from '../services/geminiService.ts';

interface InboxProps {
  emails: Email[];
  onReply: (id: string, replyText: string) => void;
}

const Inbox: React.FC<InboxProps> = ({ emails, onReply }) => {
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [replyDraft, setReplyDraft] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAiDraft = async (tone: 'professional' | 'friendly' | 'apologetic') => {
    if (!selectedEmail) return;
    setIsGenerating(true);
    try {
      const text = await generateEmailDraft("Customer", selectedEmail.body, tone);
      setReplyDraft(text);
    } catch (e: any) {
      alert(e.message || "AI failed to draft.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSend = () => {
      if(selectedEmail && replyDraft) {
          onReply(selectedEmail.id, replyDraft);
          setReplyDraft('');
          setSelectedEmail(null);
          alert("Reply sent successfully!");
      }
  }

  return (
    <div className="flex h-[calc(100vh-140px)] bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Email List */}
      <div className={`w-full md:w-1/3 border-r border-gray-200 flex flex-col ${selectedEmail ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="font-bold text-gray-800">Inbox ({emails.filter(e => e.status === 'PENDING').length})</h2>
          <button className="text-xs text-blue-600 font-medium">Mark all read</button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {emails.map(email => (
            <div 
              key={email.id}
              onClick={() => setSelectedEmail(email)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-blue-50 transition-colors ${selectedEmail?.id === email.id ? 'bg-blue-50' : ''}`}
            >
              <div className="flex justify-between mb-1">
                <span className={`font-medium text-sm ${email.isRead ? 'text-gray-600' : 'text-gray-900 font-bold'}`}>{email.from}</span>
                <span className="text-xs text-gray-400">{email.date}</span>
              </div>
              <div className="text-sm font-medium text-gray-800 mb-1 truncate">{email.subject}</div>
              <div className="text-xs text-gray-500 line-clamp-2">{email.body}</div>
              {email.status === 'REPLIED' && (
                  <span className="mt-2 inline-block px-1.5 py-0.5 bg-green-100 text-green-700 text-[10px] rounded font-medium">Replied</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Email Detail */}
      <div className={`w-full md:w-2/3 flex flex-col ${!selectedEmail ? 'hidden md:flex' : 'flex'}`}>
        {!selectedEmail ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <Mail className="w-12 h-12 mb-4 opacity-20" />
            <p>Select an email to read</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-start">
              <div>
                <button onClick={() => setSelectedEmail(null)} className="md:hidden text-gray-500 mb-2 flex items-center text-sm">
                    <ChevronRight className="w-4 h-4 rotate-180" /> Back
                </button>
                <h2 className="text-xl font-bold text-gray-900">{selectedEmail.subject}</h2>
                <div className="flex items-center mt-2 space-x-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xs">
                    {selectedEmail.from.charAt(0)}
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">{selectedEmail.from}</p>
                    <p className="text-gray-500 text-xs">to me</p>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 rounded-lg">
                  <Star className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 flex-1 overflow-y-auto bg-gray-50/50">
              <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-line">
                {selectedEmail.body}
              </div>
            </div>

            {/* AI Reply Box */}
            <div className="p-6 bg-white border-t border-gray-200">
              {selectedEmail.status === 'REPLIED' ? (
                  <div className="bg-green-50 text-green-800 p-4 rounded-lg text-sm text-center">
                      You replied to this email on {new Date().toLocaleDateString()}.
                  </div>
              ) : (
                  <>
                  <div className="mb-3 flex gap-2">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center mr-2">
                        <Sparkles className="w-3 h-3 mr-1 text-purple-500" /> AI Draft:
                    </span>
                    <button onClick={() => handleAiDraft('professional')} className="px-3 py-1 bg-purple-50 text-purple-700 text-xs rounded-full hover:bg-purple-100 border border-purple-200">Professional</button>
                    <button onClick={() => handleAiDraft('friendly')} className="px-3 py-1 bg-purple-50 text-purple-700 text-xs rounded-full hover:bg-purple-100 border border-purple-200">Friendly</button>
                    <button onClick={() => handleAiDraft('apologetic')} className="px-3 py-1 bg-purple-50 text-purple-700 text-xs rounded-full hover:bg-purple-100 border border-purple-200">Apologetic</button>
                  </div>
                  
                  <div className="relative">
                    {isGenerating && (
                        <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center text-purple-600 text-sm font-medium">
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Drafting...
                        </div>
                    )}
                    <textarea 
                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none text-sm min-h-[120px]"
                        placeholder="Type your reply here..."
                        value={replyDraft}
                        onChange={(e) => setReplyDraft(e.target.value)}
                    />
                  </div>
                  
                  <div className="mt-3 flex justify-end">
                    <button 
                        onClick={handleSend}
                        disabled={!replyDraft}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="w-4 h-4 mr-2" /> Send Reply
                    </button>
                  </div>
                  </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Inbox;