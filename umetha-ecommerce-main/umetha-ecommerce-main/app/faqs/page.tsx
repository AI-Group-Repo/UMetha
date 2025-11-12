"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MessageCircle, 
  Star, 
  ThumbsUp, 
  HelpCircle, 
  Send, 
  User, 
  Mail, 
  Phone,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Heart,
  Share2,
  Flag
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import MainLayout from '@/components/main-layout';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Review {
  id: string;
  user: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  rating: number;
  title: string;
  content: string;
  date: string;
  helpful: number;
  product?: string;
  images?: string[];
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number;
}

const mockReviews: Review[] = [
  {
    id: '1',
    user: {
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      verified: true
    },
    rating: 5,
    title: 'Amazing quality and fast shipping!',
    content: 'I ordered a dress from UMetha and it exceeded my expectations. The quality is outstanding and it arrived much faster than expected. The customer service was also very helpful when I had questions about sizing.',
    date: '2024-01-15',
    helpful: 24,
    product: 'Floral Summer Dress',
    images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&h=300&fit=crop']
  },
  {
    id: '2',
    user: {
      name: 'Mike Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      verified: true
    },
    rating: 4,
    title: 'Great product, minor sizing issue',
    content: 'The product quality is excellent and the design is exactly as shown. I had a small issue with sizing but customer service resolved it quickly. Would definitely recommend!',
    date: '2024-01-12',
    helpful: 18,
    product: 'Wireless Headphones'
  },
  {
    id: '3',
    user: {
      name: 'Emily Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      verified: false
    },
    rating: 5,
    title: 'Perfect for my needs',
    content: 'I\'ve been shopping with UMetha for over a year now and they never disappoint. Great variety, competitive prices, and excellent customer service. This latest purchase was no exception.',
    date: '2024-01-10',
    helpful: 31,
    product: 'Home Decor Set'
  }
];

const mockFAQs: FAQ[] = [
  {
    id: '1',
    question: 'How long does shipping take?',
    answer: 'We offer standard shipping (5-7 business days) and express shipping (2-3 business days). International shipping may take 7-14 business days depending on the destination.',
    category: 'Shipping',
    helpful: 45
  },
  {
    id: '2',
    question: 'What is your return policy?',
    answer: 'We offer a 30-day return policy for most items. Items must be in original condition with tags attached. Some items like electronics have a 14-day return window.',
    category: 'Returns',
    helpful: 38
  },
  {
    id: '3',
    question: 'How can I track my order?',
    answer: 'Once your order ships, you\'ll receive a tracking number via email. You can also track your order by logging into your account and visiting the "My Orders" section.',
    category: 'Orders',
    helpful: 42
  },
  {
    id: '4',
    question: 'Do you offer international shipping?',
    answer: 'Yes, we ship to over 50 countries worldwide. Shipping costs and delivery times vary by destination. Check our shipping page for detailed information.',
    category: 'Shipping',
    helpful: 29
  },
  {
    id: '5',
    question: 'How do I change my password?',
    answer: 'You can change your password by going to Account Settings > Security > Change Password. You\'ll need to enter your current password and create a new one.',
    category: 'Account',
    helpful: 22
  }
];

export default function FAQsPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('reviews');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  
  // Form states
  const [commentForm, setCommentForm] = useState({
    name: '',
    email: '',
    rating: 5,
    title: '',
    content: ''
  });
  
  const [questionForm, setQuestionForm] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: ''
  });

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Thank you!",
      description: "Your review has been submitted and will be published after moderation.",
    });
    setCommentForm({
      name: '',
      email: '',
      rating: 5,
      title: '',
      content: ''
    });
  };

  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Question Submitted!",
      description: "We'll get back to you within 24 hours.",
    });
    setQuestionForm({
      name: '',
      email: '',
      subject: '',
      category: '',
      message: ''
    });
  };

  const filteredFAQs = mockFAQs.filter(faq => {
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === '' || selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <MainLayout>
      <main className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <HelpCircle className="h-8 w-8 text-indigo-600" />
              <h1 className="text-4xl font-bold text-gray-900">
                FAQs & Reviews
              </h1>
            </div>
            <p className="text-gray-600 text-lg">
              Find answers to common questions and read reviews from our community
            </p>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="reviews" className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Reviews
                </TabsTrigger>
                <TabsTrigger value="faq" className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4" />
                  FAQs
                </TabsTrigger>
                <TabsTrigger value="comment" className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Leave Review
                </TabsTrigger>
                <TabsTrigger value="question" className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Ask Question
                </TabsTrigger>
              </TabsList>

              {/* Reviews Tab */}
              <TabsContent value="reviews">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="grid gap-6">
                {mockReviews.map((review) => (
                  <Card key={review.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={review.user.avatar} />
                          <AvatarFallback>{review.user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{review.user.name}</h3>
                            {review.user.verified && (
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                Verified
                              </Badge>
                            )}
                            <div className="flex items-center gap-1 ml-auto">
                              {renderStars(review.rating)}
                            </div>
                          </div>
                          <h4 className="font-medium text-lg mb-2">{review.title}</h4>
                          <p className="text-gray-600 mb-4">{review.content}</p>
                          {review.product && (
                            <Badge variant="outline" className="mb-4">
                              Product: {review.product}
                            </Badge>
                          )}
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>{review.date}</span>
                            <div className="flex items-center gap-4">
                              <Button variant="ghost" size="sm" className="text-gray-500">
                                <ThumbsUp className="h-4 w-4 mr-1" />
                                Helpful ({review.helpful})
                              </Button>
                              <Button variant="ghost" size="sm" className="text-gray-500">
                                <Heart className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-gray-500">
                                <Share2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          </TabsContent>

          {/* FAQ Tab */}
          <TabsContent value="faq">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search FAQs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Shipping">Shipping</SelectItem>
                    <SelectItem value="Returns">Returns</SelectItem>
                    <SelectItem value="Orders">Orders</SelectItem>
                    <SelectItem value="Account">Account</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* FAQ List */}
              <div className="space-y-4">
                {filteredFAQs.map((faq) => (
                  <Card key={faq.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                      <div
                        className="p-6 cursor-pointer"
                        onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                            <Badge variant="outline" className="mb-2">
                              {faq.category}
                            </Badge>
                          </div>
                          <Button variant="ghost" size="sm">
                            {expandedFAQ === faq.id ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        {expandedFAQ === faq.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 pt-4 border-t"
                          >
                            <p className="text-gray-600 mb-4">{faq.answer}</p>
                            <div className="flex items-center gap-4">
                              <Button variant="ghost" size="sm" className="text-gray-500">
                                <ThumbsUp className="h-4 w-4 mr-1" />
                                Helpful ({faq.helpful})
                              </Button>
                              <Button variant="ghost" size="sm" className="text-gray-500">
                                <Flag className="h-4 w-4 mr-1" />
                                Report
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          </TabsContent>

          {/* Comment Form Tab */}
          <TabsContent value="comment">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Leave a Review
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCommentSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Name *</label>
                        <Input
                          value={commentForm.name}
                          onChange={(e) => setCommentForm({...commentForm, name: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Email *</label>
                        <Input
                          type="email"
                          value={commentForm.email}
                          onChange={(e) => setCommentForm({...commentForm, email: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Rating *</label>
                      <div className="flex items-center gap-2">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={`h-6 w-6 cursor-pointer ${
                              i < commentForm.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                            onClick={() => setCommentForm({...commentForm, rating: i + 1})}
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-600">
                          {commentForm.rating} star{commentForm.rating !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Review Title *</label>
                      <Input
                        value={commentForm.title}
                        onChange={(e) => setCommentForm({...commentForm, title: e.target.value})}
                        placeholder="Summarize your experience"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Your Review *</label>
                      <Textarea
                        value={commentForm.content}
                        onChange={(e) => setCommentForm({...commentForm, content: e.target.value})}
                        placeholder="Tell us about your experience with this product..."
                        rows={4}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      <Send className="h-4 w-4 mr-2" />
                      Submit Review
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Question Form Tab */}
          <TabsContent value="question">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5" />
                    Ask a Question
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleQuestionSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Name *</label>
                        <Input
                          value={questionForm.name}
                          onChange={(e) => setQuestionForm({...questionForm, name: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Email *</label>
                        <Input
                          type="email"
                          value={questionForm.email}
                          onChange={(e) => setQuestionForm({...questionForm, email: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Subject *</label>
                      <Input
                        value={questionForm.subject}
                        onChange={(e) => setQuestionForm({...questionForm, subject: e.target.value})}
                        placeholder="Brief description of your question"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Category *</label>
                      <Select value={questionForm.category} onValueChange={(value) => setQuestionForm({...questionForm, category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Question</SelectItem>
                          <SelectItem value="shipping">Shipping & Delivery</SelectItem>
                          <SelectItem value="returns">Returns & Exchanges</SelectItem>
                          <SelectItem value="product">Product Information</SelectItem>
                          <SelectItem value="account">Account Issues</SelectItem>
                          <SelectItem value="complaint">Complaint</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Your Question or Complaint *</label>
                      <Textarea
                        value={questionForm.message}
                        onChange={(e) => setQuestionForm({...questionForm, message: e.target.value})}
                        placeholder="Please provide as much detail as possible..."
                        rows={6}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      <Send className="h-4 w-4 mr-2" />
                      Submit Question
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>
    </MainLayout>
  );
}
