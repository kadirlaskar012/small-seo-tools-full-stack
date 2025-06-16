import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Copy, Cake, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AgeCalculation {
  years: number;
  months: number;
  weeks: number;
  days: number;
  hours: number;
  minutes: number;
  totalMonths: number;
  totalWeeks: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  nextBirthday: {
    date: string;
    daysUntil: number;
    monthsUntil: number;
  };
}

export function AgeInMonthsCalculator() {
  const [birthDate, setBirthDate] = useState("");
  const [calculateFrom, setCalculateFrom] = useState("");
  const [age, setAge] = useState<AgeCalculation | null>(null);
  const [includeTime, setIncludeTime] = useState(false);
  const { toast } = useToast();

  const calculateAge = () => {
    if (!birthDate) {
      toast({
        title: "Birth Date Required",
        description: "Please enter your birth date.",
        variant: "destructive"
      });
      return;
    }

    const birth = new Date(birthDate);
    const fromDate = calculateFrom ? new Date(calculateFrom) : new Date();

    if (birth > fromDate) {
      toast({
        title: "Invalid Date",
        description: "Birth date cannot be in the future.",
        variant: "destructive"
      });
      return;
    }

    // Calculate age differences
    const timeDiff = fromDate.getTime() - birth.getTime();
    
    // Total calculations
    const totalDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = Math.floor(timeDiff / (1000 * 60 * 60));
    const totalMinutes = Math.floor(timeDiff / (1000 * 60));
    
    // Exact age calculation
    let years = fromDate.getFullYear() - birth.getFullYear();
    let months = fromDate.getMonth() - birth.getMonth();
    let days = fromDate.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(fromDate.getFullYear(), fromDate.getMonth(), 0);
      days += lastMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    const totalMonths = years * 12 + months;
    const weeks = Math.floor(days / 7);
    const remainingDays = days % 7;

    // Calculate next birthday
    let nextBirthday = new Date(fromDate.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday < fromDate) {
      nextBirthday = new Date(fromDate.getFullYear() + 1, birth.getMonth(), birth.getDate());
    }
    
    const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24));
    const monthsUntilBirthday = Math.floor(daysUntilBirthday / 30.44);

    // Calculate hours and minutes for current day
    const hours = fromDate.getHours();
    const minutes = fromDate.getMinutes();

    setAge({
      years,
      months,
      weeks,
      days: remainingDays,
      hours,
      minutes,
      totalMonths,
      totalWeeks,
      totalDays,
      totalHours,
      totalMinutes,
      nextBirthday: {
        date: nextBirthday.toISOString().split('T')[0],
        daysUntil: daysUntilBirthday,
        monthsUntil: monthsUntilBirthday
      }
    });
  };

  const copyResult = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Age information copied to clipboard."
    });
  };

  const formatAge = () => {
    if (!age) return "";
    
    const parts = [];
    if (age.years > 0) parts.push(`${age.years} year${age.years !== 1 ? 's' : ''}`);
    if (age.months > 0) parts.push(`${age.months} month${age.months !== 1 ? 's' : ''}`);
    if (age.days > 0) parts.push(`${age.days} day${age.days !== 1 ? 's' : ''}`);
    
    return parts.length > 0 ? parts.join(', ') : 'Less than a day';
  };

  const setToday = () => {
    const today = new Date().toISOString().split('T')[0];
    setCalculateFrom(today);
  };

  const getLifeStage = () => {
    if (!age) return "";
    
    const years = age.years;
    if (years < 1) return "Infant";
    if (years < 3) return "Toddler";
    if (years < 6) return "Preschooler";
    if (years < 12) return "Child";
    if (years < 18) return "Teenager";
    if (years < 30) return "Young Adult";
    if (years < 50) return "Adult";
    if (years < 65) return "Middle-aged";
    return "Senior";
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="birthDate">Birth Date *</Label>
              <Input
                id="birthDate"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="calculateFrom">Calculate From (Optional)</Label>
              <div className="flex gap-2">
                <Input
                  id="calculateFrom"
                  type="date"
                  value={calculateFrom}
                  onChange={(e) => setCalculateFrom(e.target.value)}
                  placeholder="Leave empty for current date"
                  className="flex-1"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={setToday}
                  className="whitespace-nowrap"
                >
                  Today
                </Button>
              </div>
            </div>
          </div>

          <Button onClick={calculateAge} className="w-full">
            <Calendar className="h-4 w-4 mr-2" />
            Calculate Age
          </Button>
        </CardContent>
      </Card>

      {age && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Your Age Breakdown</span>
              <Badge variant="outline">{getLifeStage()}</Badge>
            </CardTitle>
            <CardDescription>
              Calculated from {birthDate} {calculateFrom ? `to ${calculateFrom}` : 'to today'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="detailed" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="detailed">Detailed</TabsTrigger>
                <TabsTrigger value="months">In Months</TabsTrigger>
                <TabsTrigger value="totals">Totals</TabsTrigger>
                <TabsTrigger value="birthday">Birthday</TabsTrigger>
              </TabsList>
              
              <TabsContent value="detailed" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="pt-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">{age.years}</div>
                      <div className="text-sm text-muted-foreground">Years</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4 text-center">
                      <div className="text-2xl font-bold text-green-600">{age.months}</div>
                      <div className="text-sm text-muted-foreground">Months</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4 text-center">
                      <div className="text-2xl font-bold text-purple-600">{age.weeks}</div>
                      <div className="text-sm text-muted-foreground">Weeks</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4 text-center">
                      <div className="text-2xl font-bold text-orange-600">{age.days}</div>
                      <div className="text-sm text-muted-foreground">Days</div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <span className="font-medium">{formatAge()}</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyResult(formatAge())}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="months" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <div className="text-4xl font-bold text-primary">{age.totalMonths}</div>
                      <div className="text-lg text-muted-foreground mt-2">Total Months Old</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        That's {(age.totalMonths / 12).toFixed(1)} years in months
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center">
                        <span>Months this year:</span>
                        <Badge>{age.months + 1}</Badge>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center">
                        <span>Average days per month:</span>
                        <Badge>{(age.totalDays / age.totalMonths).toFixed(1)}</Badge>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center">
                        <span>Months until next birthday:</span>
                        <Badge>{age.nextBirthday.monthsUntil}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="totals" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <span>Total Days:</span>
                      <Badge variant="secondary">{age.totalDays.toLocaleString()}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <span>Total Weeks:</span>
                      <Badge variant="secondary">{age.totalWeeks.toLocaleString()}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <span>Total Hours:</span>
                      <Badge variant="secondary">{age.totalHours.toLocaleString()}</Badge>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <span>Total Minutes:</span>
                      <Badge variant="secondary">{age.totalMinutes.toLocaleString()}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <span>Heartbeats (approx):</span>
                      <Badge variant="secondary">{(age.totalMinutes * 72).toLocaleString()}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <span>Breaths (approx):</span>
                      <Badge variant="secondary">{(age.totalMinutes * 16).toLocaleString()}</Badge>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="birthday" className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center space-y-4">
                      <div className="flex items-center justify-center gap-2">
                        <Heart className="h-6 w-6 text-red-500" />
                        <h3 className="text-xl font-semibold">Next Birthday</h3>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-2xl font-bold text-primary">
                          {new Date(age.nextBirthday.date).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </div>
                        <div className="text-lg text-muted-foreground">
                          {age.nextBirthday.daysUntil} days to go
                        </div>
                        <div className="text-sm text-muted-foreground">
                          You'll turn {age.years + 1} years old
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="p-4 bg-muted rounded-lg">
                          <div className="text-lg font-semibold">{age.nextBirthday.daysUntil}</div>
                          <div className="text-sm text-muted-foreground">Days until</div>
                        </div>
                        <div className="p-4 bg-muted rounded-lg">
                          <div className="text-lg font-semibold">{Math.floor(age.nextBirthday.daysUntil / 7)}</div>
                          <div className="text-sm text-muted-foreground">Weeks until</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Button 
                  variant="outline" 
                  onClick={() => copyResult(`Next birthday: ${age.nextBirthday.date} (${age.nextBirthday.daysUntil} days)`)}
                  className="w-full"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Birthday Info
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}