import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, Percent, TrendingUp, TrendingDown, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PercentageResult {
  type: string;
  calculation: string;
  result: number;
  explanation: string;
}

export function PercentageCalculator() {
  const [activeCalculation, setActiveCalculation] = useState("basic");
  const [results, setResults] = useState<PercentageResult[]>([]);
  const { toast } = useToast();

  // Basic percentage calculation (X% of Y)
  const [basicValue, setBasicValue] = useState("");
  const [basicPercentage, setBasicPercentage] = useState("");

  // Percentage change
  const [oldValue, setOldValue] = useState("");
  const [newValue, setNewValue] = useState("");

  // What percentage
  const [partValue, setPartValue] = useState("");
  const [wholeValue, setWholeValue] = useState("");

  // Percentage increase/decrease
  const [originalValue, setOriginalValue] = useState("");
  const [increasePercentage, setIncreasePercentage] = useState("");

  // Markup/Discount calculations
  const [costPrice, setCostPrice] = useState("");
  const [markupPercentage, setMarkupPercentage] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");

  const calculateBasicPercentage = () => {
    const value = parseFloat(basicValue);
    const percentage = parseFloat(basicPercentage);
    
    if (isNaN(value) || isNaN(percentage)) {
      toast({
        title: "Invalid Input",
        description: "Please enter valid numbers",
        variant: "destructive"
      });
      return;
    }

    const result = (percentage / 100) * value;
    addResult({
      type: "Basic Percentage",
      calculation: `${percentage}% of ${value}`,
      result: result,
      explanation: `${percentage}% of ${value} = (${percentage} ÷ 100) × ${value} = ${result}`
    });
  };

  const calculatePercentageChange = () => {
    const oldVal = parseFloat(oldValue);
    const newVal = parseFloat(newValue);
    
    if (isNaN(oldVal) || isNaN(newVal) || oldVal === 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter valid numbers (old value cannot be zero)",
        variant: "destructive"
      });
      return;
    }

    const change = ((newVal - oldVal) / oldVal) * 100;
    const isIncrease = change > 0;
    
    addResult({
      type: "Percentage Change",
      calculation: `${oldVal} to ${newVal}`,
      result: Math.abs(change),
      explanation: `${isIncrease ? 'Increase' : 'Decrease'}: ((${newVal} - ${oldVal}) ÷ ${oldVal}) × 100 = ${change.toFixed(2)}%`
    });
  };

  const calculateWhatPercentage = () => {
    const part = parseFloat(partValue);
    const whole = parseFloat(wholeValue);
    
    if (isNaN(part) || isNaN(whole) || whole === 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter valid numbers (whole value cannot be zero)",
        variant: "destructive"
      });
      return;
    }

    const percentage = (part / whole) * 100;
    
    addResult({
      type: "What Percentage",
      calculation: `${part} is what % of ${whole}`,
      result: percentage,
      explanation: `(${part} ÷ ${whole}) × 100 = ${percentage.toFixed(2)}%`
    });
  };

  const calculatePercentageIncrease = () => {
    const original = parseFloat(originalValue);
    const increase = parseFloat(increasePercentage);
    
    if (isNaN(original) || isNaN(increase)) {
      toast({
        title: "Invalid Input",
        description: "Please enter valid numbers",
        variant: "destructive"
      });
      return;
    }

    const result = original + (original * increase / 100);
    
    addResult({
      type: "Percentage Increase",
      calculation: `${original} + ${increase}%`,
      result: result,
      explanation: `${original} + (${original} × ${increase}%) = ${original} + ${(original * increase / 100).toFixed(2)} = ${result.toFixed(2)}`
    });
  };

  const calculateMarkup = () => {
    const cost = parseFloat(costPrice);
    const markup = parseFloat(markupPercentage);
    
    if (isNaN(cost) || isNaN(markup)) {
      toast({
        title: "Invalid Input",
        description: "Please enter valid numbers",
        variant: "destructive"
      });
      return;
    }

    const markupAmount = cost * markup / 100;
    const sellingPrice = cost + markupAmount;
    
    addResult({
      type: "Markup Calculation",
      calculation: `Cost ${cost} + ${markup}% markup`,
      result: sellingPrice,
      explanation: `Selling Price: ${cost} + (${cost} × ${markup}%) = ${cost} + ${markupAmount.toFixed(2)} = ${sellingPrice.toFixed(2)}`
    });
  };

  const calculateDiscount = () => {
    const sale = parseFloat(salePrice);
    const discount = parseFloat(discountPercentage);
    
    if (isNaN(sale) || isNaN(discount)) {
      toast({
        title: "Invalid Input",
        description: "Please enter valid numbers",
        variant: "destructive"
      });
      return;
    }

    const discountAmount = sale * discount / 100;
    const finalPrice = sale - discountAmount;
    
    addResult({
      type: "Discount Calculation",
      calculation: `${sale} - ${discount}% discount`,
      result: finalPrice,
      explanation: `Final Price: ${sale} - (${sale} × ${discount}%) = ${sale} - ${discountAmount.toFixed(2)} = ${finalPrice.toFixed(2)}`
    });
  };

  const addResult = (result: PercentageResult) => {
    setResults(prev => [result, ...prev.slice(0, 9)]); // Keep last 10 results
  };

  const clearResults = () => {
    setResults([]);
  };

  const copyResult = (result: PercentageResult) => {
    const text = `${result.calculation} = ${result.result.toFixed(2)}`;
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Result copied to clipboard"
    });
  };

  const formatNumber = (num: number): string => {
    return num % 1 === 0 ? num.toString() : num.toFixed(2);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Percentage Calculator</h2>
        <p className="text-muted-foreground">
          Calculate percentages, percentage changes, discounts, markups, and more
        </p>
      </div>

      <Tabs value={activeCalculation} onValueChange={setActiveCalculation}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="basic">Basic %</TabsTrigger>
          <TabsTrigger value="change">% Change</TabsTrigger>
          <TabsTrigger value="what">What %</TabsTrigger>
          <TabsTrigger value="increase">Increase</TabsTrigger>
          <TabsTrigger value="markup">Markup</TabsTrigger>
          <TabsTrigger value="discount">Discount</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Basic Percentage Calculation
              </CardTitle>
              <CardDescription>Calculate X% of Y</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                  <Label htmlFor="basicPercentage">Percentage</Label>
                  <Input
                    id="basicPercentage"
                    type="number"
                    value={basicPercentage}
                    onChange={(e) => setBasicPercentage(e.target.value)}
                    placeholder="25"
                  />
                </div>
                <div>
                  <Label htmlFor="basicValue">Value</Label>
                  <Input
                    id="basicValue"
                    type="number"
                    value={basicValue}
                    onChange={(e) => setBasicValue(e.target.value)}
                    placeholder="200"
                  />
                </div>
                <Button onClick={calculateBasicPercentage}>
                  <Percent className="h-4 w-4 mr-2" />
                  Calculate
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                Example: 25% of 200 = 50
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="change" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Percentage Change
              </CardTitle>
              <CardDescription>Calculate percentage increase or decrease between two values</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                  <Label htmlFor="oldValue">Old Value</Label>
                  <Input
                    id="oldValue"
                    type="number"
                    value={oldValue}
                    onChange={(e) => setOldValue(e.target.value)}
                    placeholder="100"
                  />
                </div>
                <div>
                  <Label htmlFor="newValue">New Value</Label>
                  <Input
                    id="newValue"
                    type="number"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    placeholder="120"
                  />
                </div>
                <Button onClick={calculatePercentageChange}>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Calculate
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                Example: From 100 to 120 = 20% increase
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="what" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                What Percentage
              </CardTitle>
              <CardDescription>Find what percentage one number is of another</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                  <Label htmlFor="partValue">Part Value</Label>
                  <Input
                    id="partValue"
                    type="number"
                    value={partValue}
                    onChange={(e) => setPartValue(e.target.value)}
                    placeholder="50"
                  />
                </div>
                <div>
                  <Label htmlFor="wholeValue">Whole Value</Label>
                  <Input
                    id="wholeValue"
                    type="number"
                    value={wholeValue}
                    onChange={(e) => setWholeValue(e.target.value)}
                    placeholder="200"
                  />
                </div>
                <Button onClick={calculateWhatPercentage}>
                  <Percent className="h-4 w-4 mr-2" />
                  Calculate
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                Example: 50 is what % of 200? = 25%
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="increase" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Percentage Increase/Decrease
              </CardTitle>
              <CardDescription>Add or subtract a percentage from a value</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                  <Label htmlFor="originalValue">Original Value</Label>
                  <Input
                    id="originalValue"
                    type="number"
                    value={originalValue}
                    onChange={(e) => setOriginalValue(e.target.value)}
                    placeholder="100"
                  />
                </div>
                <div>
                  <Label htmlFor="increasePercentage">Percentage (+/-)</Label>
                  <Input
                    id="increasePercentage"
                    type="number"
                    value={increasePercentage}
                    onChange={(e) => setIncreasePercentage(e.target.value)}
                    placeholder="15"
                  />
                </div>
                <Button onClick={calculatePercentageIncrease}>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Calculate
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                Example: 100 + 15% = 115 | Use negative for decrease: -15%
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="markup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Markup Calculation
              </CardTitle>
              <CardDescription>Calculate selling price with markup percentage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                  <Label htmlFor="costPrice">Cost Price</Label>
                  <Input
                    id="costPrice"
                    type="number"
                    value={costPrice}
                    onChange={(e) => setCostPrice(e.target.value)}
                    placeholder="100"
                  />
                </div>
                <div>
                  <Label htmlFor="markupPercentage">Markup %</Label>
                  <Input
                    id="markupPercentage"
                    type="number"
                    value={markupPercentage}
                    onChange={(e) => setMarkupPercentage(e.target.value)}
                    placeholder="30"
                  />
                </div>
                <Button onClick={calculateMarkup}>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Calculate
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                Example: Cost $100 + 30% markup = Selling price $130
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="discount" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5" />
                Discount Calculation
              </CardTitle>
              <CardDescription>Calculate final price after discount</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                  <Label htmlFor="salePrice">Original Price</Label>
                  <Input
                    id="salePrice"
                    type="number"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    placeholder="150"
                  />
                </div>
                <div>
                  <Label htmlFor="discountPercentage">Discount %</Label>
                  <Input
                    id="discountPercentage"
                    type="number"
                    value={discountPercentage}
                    onChange={(e) => setDiscountPercentage(e.target.value)}
                    placeholder="20"
                  />
                </div>
                <Button onClick={calculateDiscount}>
                  <TrendingDown className="h-4 w-4 mr-2" />
                  Calculate
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                Example: $150 - 20% discount = Final price $120
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Calculation History</span>
              <Button variant="outline" size="sm" onClick={clearResults}>
                Clear All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {results.map((result, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{result.type}</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyResult(result)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="font-medium">{result.calculation}</div>
                  <div className="text-2xl font-bold text-primary">
                    {formatNumber(result.result)}
                    {result.type.includes('Percentage') || result.type.includes('What') ? '%' : ''}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {result.explanation}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}