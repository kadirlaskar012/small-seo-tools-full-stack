import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DateDifference {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
}

export function DateDifferenceCalculator() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [difference, setDifference] = useState<DateDifference | null>(null);
  const [includeTime, setIncludeTime] = useState(false);
  const { toast } = useToast();

  const calculateDifference = () => {
    if (!startDate || !endDate) {
      toast({
        title: "Missing Dates",
        description: "Please select both start and end dates.",
        variant: "destructive"
      });
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      toast({
        title: "Invalid Date Range",
        description: "Start date must be before end date.",
        variant: "destructive"
      });
      return;
    }

    // Calculate differences
    const timeDiff = end.getTime() - start.getTime();
    const totalDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = Math.floor(timeDiff / (1000 * 60 * 60));
    const totalMinutes = Math.floor(timeDiff / (1000 * 60));
    const totalSeconds = Math.floor(timeDiff / 1000);

    // Calculate years, months, days
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(end.getFullYear(), end.getMonth(), 0);
      days += lastMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    setDifference({
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      totalHours,
      totalMinutes,
      totalSeconds
    });
  };

  const copyResult = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Result copied to clipboard."
    });
  };

  const formatResult = () => {
    if (!difference) return "";
    
    const parts = [];
    if (difference.years > 0) parts.push(`${difference.years} year${difference.years !== 1 ? 's' : ''}`);
    if (difference.months > 0) parts.push(`${difference.months} month${difference.months !== 1 ? 's' : ''}`);
    if (difference.days > 0) parts.push(`${difference.days} day${difference.days !== 1 ? 's' : ''}`);
    
    return parts.length > 0 ? parts.join(', ') : '0 days';
  };

  const setToday = (field: 'start' | 'end') => {
    const today = new Date().toISOString().split('T')[0];
    if (field === 'start') {
      setStartDate(today);
    } else {
      setEndDate(today);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <div className="flex gap-2">
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setToday('start')}
                  className="whitespace-nowrap"
                >
                  Today
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <div className="flex gap-2">
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setToday('end')}
                  className="whitespace-nowrap"
                >
                  Today
                </Button>
              </div>
            </div>
          </div>

          <Button onClick={calculateDifference} className="w-full">
            <Clock className="h-4 w-4 mr-2" />
            Calculate Difference
          </Button>
        </CardContent>
      </Card>

      {difference && (
        <Card>
          <CardHeader>
            <CardTitle>Date Difference Results</CardTitle>
            <CardDescription>
              Calculated difference between {startDate} and {endDate}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="detailed" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="detailed">Detailed</TabsTrigger>
                <TabsTrigger value="totals">Totals</TabsTrigger>
                <TabsTrigger value="summary">Summary</TabsTrigger>
              </TabsList>
              
              <TabsContent value="detailed" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">{difference.years}</div>
                      <div className="text-sm text-muted-foreground">Year{difference.years !== 1 ? 's' : ''}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4 text-center">
                      <div className="text-2xl font-bold text-green-600">{difference.months}</div>
                      <div className="text-sm text-muted-foreground">Month{difference.months !== 1 ? 's' : ''}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4 text-center">
                      <div className="text-2xl font-bold text-purple-600">{difference.days}</div>
                      <div className="text-sm text-muted-foreground">Day{difference.days !== 1 ? 's' : ''}</div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <span className="font-medium">{formatResult()}</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyResult(formatResult())}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="totals" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <span>Total Days:</span>
                      <Badge variant="secondary">{difference.totalDays.toLocaleString()}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <span>Total Weeks:</span>
                      <Badge variant="secondary">{difference.totalWeeks.toLocaleString()}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <span>Total Hours:</span>
                      <Badge variant="secondary">{difference.totalHours.toLocaleString()}</Badge>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <span>Total Minutes:</span>
                      <Badge variant="secondary">{difference.totalMinutes.toLocaleString()}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <span>Total Seconds:</span>
                      <Badge variant="secondary">{difference.totalSeconds.toLocaleString()}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <span>Business Days:</span>
                      <Badge variant="secondary">{Math.floor(difference.totalDays * 5/7).toLocaleString()}</Badge>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="summary" className="space-y-4">
                <div className="prose prose-sm max-w-none">
                  <h3>Date Calculation Summary</h3>
                  <ul>
                    <li><strong>Start Date:</strong> {new Date(startDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</li>
                    <li><strong>End Date:</strong> {new Date(endDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</li>
                    <li><strong>Difference:</strong> {formatResult()}</li>
                    <li><strong>Total Days:</strong> {difference.totalDays.toLocaleString()} days</li>
                    <li><strong>Percentage of Year:</strong> {((difference.totalDays / 365.25) * 100).toFixed(2)}%</li>
                  </ul>
                </div>
                
                <Button 
                  variant="outline" 
                  onClick={() => copyResult(`Date difference: ${formatResult()} (${difference.totalDays} total days)`)}
                  className="w-full"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Summary
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}