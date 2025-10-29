"use client";

import { useEffect, useState } from 'react';
import { pollAPI, PollResponse } from '@/contexts/backend';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Heart, Users, MessageSquare, Plus } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { io } from 'socket.io-client';

export default function Polls() {
  const [polls, setPolls] = useState<PollResponse[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [apiLoading, setApiLoading] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      fetchUserPolls();
    }
  }, [user]);

  useEffect(() => {
    if (!user) return; 

    const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001', {
      path: "/ws/updates"
    });

    socket.on('connect', () => {
      console.log('WebSocket connected:', socket.id);
    });

    socket.on('vote-update', (data) => {
      console.log('Vote update received:', data);
      
      setPolls(prevPolls =>
        prevPolls.map(poll => {
          if (poll.id === data.poll_id) {
            const newCounts = {
              ...poll.counts,
              [data.option_id]: data.vote_count,
            };
            return {
              ...poll,
              counts: newCounts,
              userHasVoted: data.user_id === user.id ? data.option_id : poll.userHasVoted
            };
          }
          return poll;
        })
      );
    });

    socket.on('like-update', (data) => {
      console.log('Like update received:', data);
      setPolls(prevPolls =>
        prevPolls.map(poll => {
          if (poll.id === data.poll_id) {
            const newCounts = {
              ...poll.counts,
              likes: data.like_count,
            };
            return {
              ...poll,
              counts: newCounts,
              userHasLiked: data.user_id === user.id ? true : poll.userHasLiked
            };
          }
          return poll;
        })
      );
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const fetchUserPolls = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const data = await pollAPI.getPollsByUserId(user.id);
      setPolls(data);
    } catch (error) {
      console.error('Failed to fetch user polls:', error);
      toast.error('Failed to load your polls');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (pollId: string, optionId: string) => {
    if (!user) return;
    
    try {
      setApiLoading(`${pollId}-${optionId}`);
      await pollAPI.voteOnPoll(pollId, optionId);
      toast.success('Vote recorded!');
    } catch (error) {
      console.error('Failed to vote:', error);
      toast.error('Failed to vote. Please try again.');
    } finally {
      setApiLoading(null);
    }
  };

  const handleLike = async (pollId: string) => {
    if (!user) return;
    
    try {
      setApiLoading(pollId);
      // Send the like. The WebSocket will handle the state update.
      await pollAPI.likePoll(pollId);
      toast.success('Like updated!');
    } catch (error) {
      console.error('Failed to like:', error);
      toast.error('Failed to like poll. Please try again.');
    } finally {
      setApiLoading(null);
    }
  };

  const getTotalVotes = (poll: PollResponse) => {
    return poll.options.reduce((total, option) => {
      return total + (poll.counts[option.id as string] || 0);
    }, 0);
  };

  if (loading) {
    return (
      <div className="p-4 lg:p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Polls</h1>
            <p className="text-muted-foreground">
              Manage and view your created polls
            </p>
          </div>
          <Link href="/create_poll">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Poll
            </Button>
          </Link>
        </div>

        {polls.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No polls created yet</h3>
            <p className="text-muted-foreground">Create your first poll to get started!</p>
            <Link href="/create_poll">
              <Button className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Poll
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {polls.map((poll) => {
              const totalVotes = getTotalVotes(poll);
              const userVoted = !!poll.userHasVoted;
              const userLiked = poll.userHasLiked;
              
              return (
                <Card key={poll.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{poll.question}</CardTitle>
                    <CardDescription>
                      Created {new Date(poll.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {poll.options?.map((option) => {
                      const optionVotes = poll.counts[option.id as string] || 0;
                      const percentage = totalVotes > 0 ? (optionVotes / totalVotes) * 100 : 0;
                      const isVoting = apiLoading === `${poll.id}-${option.id}`;
                      
                      return (
                        <div key={option.id} className="space-y-2">
                          <Button
                            variant={poll.userHasVoted === option.id ? "default" : "secondary"}
                            className="w-full justify-start text-left h-auto py-3"
                            onClick={() => handleVote(poll.id!, option.id!)}
                            disabled={userVoted || isVoting}
                          >
                            <div className="flex-1">
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-medium">{option.text}</span>
                                <span className="text-sm text-muted-foreground">
                                  {optionVotes} votes
                                </span>
                              </div>
                              {(userVoted || isVoting) && (
                                <Progress value={percentage} className="h-2" />
                              )}
                            </div>
                          </Button>
                        </div>
                      );
                    })}
                    
                    <div className="flex justify-between items-center pt-4 border-t">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{totalVotes} total votes</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(poll.id!)}
                        disabled={apiLoading === poll.id}
                        className={userLiked ? 'text-red-500' : ''}
                      >
                        <Heart className={`h-4 w-4 mr-1 ${userLiked ? 'fill-current' : ''}`} />
                        {poll.counts.likes || 0}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
