import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { SCHEMA_TYPES, SCHEMA_FIELD_TEMPLATES, generateSchemaPreview, validateSchemaMarkup } from "@/lib/schema-utils";
import { Plus, Edit, Trash2, Eye, Save, Copy, Check } from "lucide-react";

interface SchemaTemplate {
  id: number;
  name: string;
  schemaType: string;
  isGlobal: boolean;
  isActive: boolean;
  schemaData: any;
  createdAt: string;
  updatedAt: string;
}

interface PageSchema {
  id: number;
  pageType: string;
  pageId?: number;
  schemaTemplateId?: number;
  customSchemaData?: any;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function SchemaManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTemplate, setSelectedTemplate] = useState<SchemaTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [schemaPreview, setSchemaPreview] = useState("");
  const [copied, setCopied] = useState(false);

  // Form state for creating/editing templates
  const [formData, setFormData] = useState({
    name: "",
    schemaType: "",
    isGlobal: false,
    isActive: true,
    schemaData: {},
  });

  // Fetch schema templates
  const { data: templates = [], isLoading: templatesLoading } = useQuery({
    queryKey: ["/api/schema-templates"],
  });

  // Fetch page schemas
  const { data: pageSchemas = [], isLoading: pageSchemasLoading } = useQuery({
    queryKey: ["/api/page-schemas"],
  });

  // Create template mutation
  const createTemplateMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("/api/schema-templates", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/schema-templates"] });
      toast({
        title: "Success",
        description: "Schema template created successfully",
      });
      resetForm();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create schema template",
        variant: "destructive",
      });
    },
  });

  // Update template mutation
  const updateTemplateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      return await apiRequest(`/api/schema-templates/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/schema-templates"] });
      toast({
        title: "Success",
        description: "Schema template updated successfully",
      });
      setIsEditing(false);
      setSelectedTemplate(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update schema template",
        variant: "destructive",
      });
    },
  });

  // Delete template mutation
  const deleteTemplateMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/schema-templates/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/schema-templates"] });
      toast({
        title: "Success",
        description: "Schema template deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete schema template",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      schemaType: "",
      isGlobal: false,
      isActive: true,
      schemaData: {},
    });
    setIsEditing(false);
    setSelectedTemplate(null);
  };

  const handleSchemaTypeChange = (schemaType: string) => {
    const template = SCHEMA_FIELD_TEMPLATES[schemaType as keyof typeof SCHEMA_FIELD_TEMPLATES];
    const schemaData = {
      "@context": "https://schema.org",
      "@type": schemaType,
      ...Object.keys(template || {}).reduce((acc, key) => {
        acc[key] = "";
        return acc;
      }, {} as any),
    };

    setFormData(prev => ({
      ...prev,
      schemaType,
      schemaData,
    }));
  };

  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      schemaData: {
        ...prev.schemaData,
        [field]: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateSchemaMarkup(formData.schemaData)) {
      toast({
        title: "Validation Error",
        description: "Invalid schema markup. Please check your data.",
        variant: "destructive",
      });
      return;
    }

    if (isEditing && selectedTemplate) {
      updateTemplateMutation.mutate({ id: selectedTemplate.id, data: formData });
    } else {
      createTemplateMutation.mutate(formData);
    }
  };

  const handleEdit = (template: SchemaTemplate) => {
    setSelectedTemplate(template);
    setFormData({
      name: template.name,
      schemaType: template.schemaType,
      isGlobal: template.isGlobal,
      isActive: template.isActive,
      schemaData: template.schemaData,
    });
    setIsEditing(true);
  };

  const handleCopySchema = () => {
    const schema = selectedTemplate ? selectedTemplate.schemaData : formData.schemaData;
    navigator.clipboard.writeText(generateSchemaPreview(schema));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied",
      description: "Schema markup copied to clipboard",
    });
  };

  useEffect(() => {
    const schema = selectedTemplate ? selectedTemplate.schemaData : formData.schemaData;
    setSchemaPreview(generateSchemaPreview(schema));
  }, [formData.schemaData, selectedTemplate]);

  const renderSchemaFields = () => {
    const schemaType = formData.schemaType;
    const template = SCHEMA_FIELD_TEMPLATES[schemaType as keyof typeof SCHEMA_FIELD_TEMPLATES];
    
    if (!template) return null;

    return Object.entries(template).map(([field, type]) => (
      <div key={field} className="space-y-2">
        <Label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
        {type === "string" ? (
          <Input
            id={field}
            value={formData.schemaData[field] || ""}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            placeholder={`Enter ${field}`}
          />
        ) : type === "date" ? (
          <Input
            id={field}
            type="datetime-local"
            value={formData.schemaData[field] || ""}
            onChange={(e) => handleFieldChange(field, e.target.value)}
          />
        ) : type === "number" ? (
          <Input
            id={field}
            type="number"
            value={formData.schemaData[field] || ""}
            onChange={(e) => handleFieldChange(field, parseFloat(e.target.value) || 0)}
            placeholder={`Enter ${field}`}
          />
        ) : type === "array" ? (
          <Textarea
            id={field}
            value={Array.isArray(formData.schemaData[field]) 
              ? formData.schemaData[field].join(", ") 
              : formData.schemaData[field] || ""
            }
            onChange={(e) => handleFieldChange(field, e.target.value.split(", ").filter(Boolean))}
            placeholder={`Enter ${field} (comma-separated)`}
            rows={3}
          />
        ) : (
          <Textarea
            id={field}
            value={typeof formData.schemaData[field] === "object" 
              ? JSON.stringify(formData.schemaData[field], null, 2)
              : formData.schemaData[field] || ""
            }
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                handleFieldChange(field, parsed);
              } catch {
                handleFieldChange(field, e.target.value);
              }
            }}
            placeholder={`Enter ${field} (JSON object)`}
            rows={4}
          />
        )}
      </div>
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Schema Markup Manager</h2>
          <p className="text-muted-foreground">
            Create and manage JSON-LD schema templates for SEO optimization
          </p>
        </div>
        <Button onClick={resetForm} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Template
        </Button>
      </div>

      <Tabs defaultValue="templates" className="space-y-4">
        <TabsList>
          <TabsTrigger value="templates">Schema Templates</TabsTrigger>
          <TabsTrigger value="page-schemas">Page Schemas</TabsTrigger>
          <TabsTrigger value="create">Create/Edit</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((template: SchemaTemplate) => (
              <Card key={template.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      {template.isGlobal && <Badge variant="secondary">Global</Badge>}
                      {template.isActive && <Badge variant="default">Active</Badge>}
                    </div>
                  </div>
                  <CardDescription>{template.schemaType}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(template)}
                      className="flex items-center gap-1"
                    >
                      <Edit className="h-3 w-3" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedTemplate(template)}
                      className="flex items-center gap-1"
                    >
                      <Eye className="h-3 w-3" />
                      Preview
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteTemplateMutation.mutate(template.id)}
                      className="flex items-center gap-1"
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedTemplate && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Schema Preview: {selectedTemplate.name}</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopySchema}
                    className="flex items-center gap-1"
                  >
                    {copied ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm">
                  {generateSchemaPreview(selectedTemplate.schemaData)}
                </pre>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="page-schemas" className="space-y-4">
          <div className="grid gap-4">
            {pageSchemas.map((schema: PageSchema) => (
              <Card key={schema.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {schema.pageType} {schema.pageId ? `#${schema.pageId}` : "(Global)"}
                    </CardTitle>
                    <Badge variant={schema.isActive ? "default" : "secondary"}>
                      {schema.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{isEditing ? "Edit Template" : "Create Template"}</CardTitle>
                <CardDescription>
                  Configure schema template settings and structure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Template Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter template name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="schemaType">Schema Type</Label>
                    <Select
                      value={formData.schemaType}
                      onValueChange={handleSchemaTypeChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select schema type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(SCHEMA_TYPES).map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isGlobal"
                      checked={formData.isGlobal}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, isGlobal: checked }))
                      }
                    />
                    <Label htmlFor="isGlobal">Global Template</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, isActive: checked }))
                      }
                    />
                    <Label htmlFor="isActive">Active</Label>
                  </div>

                  {formData.schemaType && (
                    <div className="space-y-4">
                      <h4 className="font-medium">Schema Fields</h4>
                      {renderSchemaFields()}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button type="submit" disabled={createTemplateMutation.isPending || updateTemplateMutation.isPending}>
                      <Save className="h-4 w-4 mr-2" />
                      {isEditing ? "Update" : "Create"} Template
                    </Button>
                    {isEditing && (
                      <Button type="button" variant="outline" onClick={resetForm}>
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Live Preview</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopySchema}
                    className="flex items-center gap-1"
                  >
                    {copied ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                </div>
                <CardDescription>
                  Real-time JSON-LD preview
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm max-h-96">
                  {schemaPreview}
                </pre>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}