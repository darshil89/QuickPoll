"use client"

import { useEffect, useState } from 'react';
import { pollAPI, PollResponse } from '@/contexts/backend';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Heart, Users, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

export default function Dashboard() {
  const [polls, setPolls] = useState<PollResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState<string | null>(null);
  const [liking, setLiking] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      setLoading(true);
      const data = await pollAPI.getAllPolls();
      setPolls(data);
    } catch (error) {
      console.error('Failed to fetch polls:', error);
      toast.error('Failed to load polls');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (pollId: string, optionId: string) => {
    if (!user) return;
    
    try {
      setVoting(`${pollId}-${optionId}`);
      const updatedPoll = await pollAPI.voteOnPoll(pollId, optionId);
      
      // Update the poll in the list
      setPolls(prev => prev.map(poll => 
        poll.id === pollId ? updatedPoll : poll
      ));
      
      toast.success('Vote recorded successfully!');
    } catch (error) {
      console.error('Failed to vote:', error);
      toast.error('Failed to vote. Please try again.');
    } finally {
      setVoting(null);
    }
  };

  const handleLike = async (pollId: string) => {
    if (!user) return;
    
    try {
      setLiking(pollId);
      const updatedPoll = await pollAPI.likePoll(pollId);
      
      // Update the poll in the list
      setPolls(prev => prev.map(poll => 
        poll.id === pollId ? updatedPoll : poll
      ));
      
      toast.success('Like updated!');
    } catch (error) {
      console.error('Failed to like:', error);
      toast.error('Failed to like poll. Please try again.');
    } finally {
      setLiking(null);
    }
  };

  const getTotalVotes = (poll: PollResponse) => {
    return poll.options?.reduce((total, option) => 
      total + (option.votes?.length || 0), 0
    ) || 0;
  };

  const hasUserVoted = (poll: PollResponse) => {
    if (!user) return false;
    return poll.options?.some(option => 
      option.votes?.some(vote => vote.userId === user.id)
    ) || false;
  };

  const hasUserLiked = (poll: PollResponse) => {
    if (!user) return false;
    return poll.likes?.some(like => like.userId === user.id) || false;
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
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Polls</h1>
          <p className="text-muted-foreground">
            Vote on polls and see what others think
          </p>
        </div>

        {polls.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No polls yet</h3>
            <p className="text-muted-foreground">Be the first to create a poll!</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {polls.map((poll) => {
              const totalVotes = getTotalVotes(poll);
              const userVoted = hasUserVoted(poll);
              const userLiked = hasUserLiked(poll);
              
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
                      const optionVotes = option.votes?.length || 0;
                      const percentage = totalVotes > 0 ? (optionVotes / totalVotes) * 100 : 0;
                      const isVoting = voting === `${poll.id}-${option.id}`;
                      
                      return (
                        <div key={option.id} className="space-y-2">
                          <Button
                            variant={userVoted ? "outline" : "secondary"}
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
                              {userVoted && (
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
                        disabled={liking === poll.id}
                        className={userLiked ? 'text-red-500' : ''}
                      >
                        <Heart className={`h-4 w-4 mr-1 ${userLiked ? 'fill-current' : ''}`} />
                        {poll.likes?.length || 0}
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
};