import React, { useState } from 'react';
import { Star, MessageSquare, ThumbsUp, AlertOctagon, Check, Sparkles, Loader2 } from 'lucide-react';
import { Review } from '../types.ts';
import { generateReviewReply } from '../services/geminiService.ts';

interface ReviewsProps {
  reviews: Review[];
  onUpdateReview: (review: Review) => void;
}

const Reviews: React.FC<ReviewsProps> = ({ reviews, onUpdateReview }) => {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [draftReply, setDraftReply] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleAutoReply = async (review: Review) => {
    setReplyingTo(review.id);
    setIsAiLoading(true);
    try {
        const text = await generateReviewReply(review.customer, review.rating, review.comment);
        setDraftReply(text);
    } catch (e: any) {
        setDraftReply(e.message || "Failed to generate reply.");
    } finally {
        setIsAiLoading(false);
    }
  };

  const submitReply = (review: Review) => {
      onUpdateReview({
          ...review,
          status: 'APPROVED',
          reply: draftReply
      });
      setReplyingTo(null);
      setDraftReply('');
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Reviews & Reputation</h1>
            <p className="text-sm text-gray-500 mt-1">Manage feedback from your customers.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm flex items-center">
            <Star className="w-5 h-5 text-yellow-400 fill-current mr-2" />
            <span className="font-bold text-gray-900 text-lg mr-1">4.8</span>
            <span className="text-xs text-gray-500">Average Rating</span>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map(review => (
          <div key={review.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
               <div className="flex items-center">
                   <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-500 mr-3">
                       {review.customer.charAt(0)}
                   </div>
                   <div>
                       <h3 className="text-sm font-bold text-gray-900">{review.customer}</h3>
                       <div className="flex items-center">
                           {[...Array(5)].map((_, i) => (
                               <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                           ))}
                           <span className="text-xs text-gray-400 ml-2">on {review.productName}</span>
                       </div>
                   </div>
               </div>
               <div>
                   {review.status === 'PENDING' && <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded">Needs Attention</span>}
                   {review.status === 'APPROVED' && <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded">Public</span>}
                   {review.status === 'SPAM' && <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-bold rounded">Spam</span>}
               </div>
            </div>

            <p className="text-gray-700 text-sm mb-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                "{review.comment}"
            </p>

            {/* Actions Area */}
            {review.reply ? (
                <div className="ml-12 pl-4 border-l-2 border-blue-200">
                    <p className="text-xs font-bold text-blue-800 mb-1">Your Reply:</p>
                    <p className="text-sm text-gray-600">{review.reply}</p>
                </div>
            ) : (
                <div className="flex flex-col space-y-3">
                    {replyingTo === review.id ? (
                        <div className="animate-in fade-in slide-in-from-top-2">
                             <div className="relative">
                                <textarea 
                                    className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    rows={3}
                                    value={draftReply}
                                    onChange={(e) => setDraftReply(e.target.value)}
                                    placeholder="Write a response..."
                                />
                                {isAiLoading && (
                                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center text-sm text-purple-600">
                                        <Loader2 className="animate-spin w-4 h-4 mr-2" /> Generating response...
                                    </div>
                                )}
                             </div>
                             <div className="flex justify-end space-x-2 mt-2">
                                 <button onClick={() => setReplyingTo(null)} className="text-xs text-gray-500 px-3 py-1 hover:text-gray-900">Cancel</button>
                                 <button onClick={() => submitReply(review)} className="bg-blue-600 text-white text-xs px-4 py-2 rounded-lg font-medium hover:bg-blue-700">Post Reply</button>
                             </div>
                        </div>
                    ) : (
                        <div className="flex space-x-3">
                            <button 
                                onClick={() => handleAutoReply(review)}
                                className="flex items-center px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium border border-purple-200 hover:bg-purple-100 transition-colors"
                            >
                                <Sparkles className="w-3 h-3 mr-1.5" /> AI Reply
                            </button>
                            <button 
                                onClick={() => setReplyingTo(review.id)}
                                className="flex items-center px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50"
                            >
                                <MessageSquare className="w-3 h-3 mr-1.5" /> Manual Reply
                            </button>
                            {review.status === 'PENDING' && (
                                <>
                                    <div className="w-px h-6 bg-gray-300 mx-2"></div>
                                    <button 
                                        onClick={() => onUpdateReview({...review, status: 'APPROVED'})}
                                        className="text-green-600 hover:text-green-800 p-1" title="Approve"
                                    >
                                        <Check className="w-5 h-5" />
                                    </button>
                                    <button 
                                        onClick={() => onUpdateReview({...review, status: 'SPAM'})}
                                        className="text-red-600 hover:text-red-800 p-1" title="Mark Spam"
                                    >
                                        <AlertOctagon className="w-5 h-5" />
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;