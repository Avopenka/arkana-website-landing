'use client'
import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
interface ManualIssueReportProps {
  onSuccess?: () => void;
}
export function ManualIssueReport({ onSuccess }: ManualIssueReportProps) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'general',
    component: '',
    environment: 'production',
    impact_score: '50'
  })
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const issue = {
        source: 'manual_report',
        priority: formData.priority,
        status: 'open',
        title: formData.title,
        description: formData.description,
        category: formData.category,
        component: formData.component || null,
        environment: formData.environment,
        assignee_email: user?.email || null,
        impact_score: parseInt(formData.impact_score),
        metadata: {
          reported_by: user?.email,
          reported_at: new Date().toISOString()
        }
      }
      const { data, error: insertError } = await supabase
        .from('unified_issues')
        .insert(issue)
        .select()
        .single()
      if (insertError) throw insertError
      // Add timeline entry
      await supabase
        .from('issue_timeline')
        .insert({
          issue_id: data.id,
          event_type: 'created',
          actor_email: user?.email,
          comment: 'Issue manually reported by admin',
          metadata: { source: 'manual_report' }
        })
      setSuccess(true)
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        category: 'general',
        component: '',
        environment: 'production',
        impact_score: '50'
      })
      if (onSuccess) onSuccess()
      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError('Failed to create issue. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Report an Issue</CardTitle>
        <CardDescription>
          Manually create an issue for tracking in the unified dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Brief description of the issue"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed description, steps to reproduce, etc."
              rows={4}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="bug">Bug</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                  <SelectItem value="feature">Feature Request</SelectItem>
                  <SelectItem value="ui">UI/UX</SelectItem>
                  <SelectItem value="documentation">Documentation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="component">Component</Label>
              <Input
                id="component"
                value={formData.component}
                onChange={(e) => setFormData({ ...formData, component: e.target.value })}
                placeholder="e.g., Dashboard, API, Auth"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="environment">Environment</Label>
              <Select
                value={formData.environment}
                onValueChange={(value) => setFormData({ ...formData, environment: value })}
              >
                <SelectTrigger id="environment">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="production">Production</SelectItem>
                  <SelectItem value="staging">Staging</SelectItem>
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="ci">CI/CD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="impact">Impact Score (0-100)</Label>
            <Input
              id="impact"
              type="number"
              min="0"
              max="100"
              value={formData.impact_score}
              onChange={(e) => setFormData({ ...formData, impact_score: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              Estimate the impact on users/system (0 = minimal, 100 = critical)
            </p>
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-600">
                Issue created successfully!
              </AlertDescription>
            </Alert>
          )}
          <Button type="submit" disabled={loading || !formData.title} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Issue...
              </>
            ) : (
              'Create Issue'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}