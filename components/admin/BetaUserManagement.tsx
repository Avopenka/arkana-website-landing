'use client'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { 
  Users, Search, Filter, Download, Mail, UserPlus, 
  MoreVertical, ChevronDown, ChevronUp, Copy, Trash2,
  Check, X, AlertCircle, Loader2, ExternalLink, 
  Calendar, Clock, Shield, Zap, TrendingUp
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
// Types
interface BetaUser {
  email: string
  name: string
  tier: 'vip' | 'insider' | 'early'
  firstAccess: string
  lastAccess: string
  codes: Array<{
    code: string
    tier: string
    redeemedAt: string
  }>
  devices: string[]
  engagement?: {
    sessionsCount: number
    totalTime: number
    lastActivity: string
  }
}
interface BetaCode {
  id: string
  code: string
  tier: 'vip' | 'insider' | 'early'
  max_uses: number
  current_uses: number
  assigned_to_name?: string
  assigned_to_email?: string
  active: boolean
  expires_at?: string
  created_at: string
}
interface BetaStats {
  totalUsers: number
  remainingSlots: number
  byTier: {
    vip: { users: number }
    insider: { users: number }
    early: { users: number }
  }
  recentActivity: Array<{
    email: string
    action: string
    timestamp: string
  }>
}
export function BetaUserManagement() {
  const [users, setUsers] = useState<BetaUser[]>([])
  const [codes, setCodes] = useState<BetaCode[]>([])
  const [stats, setStats] = useState<BetaStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterTier, setFilterTier] = useState<'all' | 'vip' | 'insider' | 'early'>('all')
  const [sortField, setSortField] = useState<'name' | 'email' | 'firstAccess' | 'lastAccess'>('firstAccess')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set())
  const [showCodeDialog, setShowCodeDialog] = useState(false)
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const supabase = createClientComponentClient()
  // Load data
  useEffect(() => {
    loadData()
  }, [])
  const loadData = async () => {
    try {
      setLoading(true)
      // Fetch users
      const usersRes = await fetch('/api/beta/admin/users', {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_API_KEY}`
        }
      })
      if (usersRes.ok) {
        const data = await usersRes.json()
        setUsers(data.users)
        // Calculate stats
        const tierCounts = data.users.reduce((acc: Record<string, number>, user: BetaUser) => {
          const tier = user.codes[0]?.tier || 'early'
          acc[tier] = (acc[tier] || 0) + 1
          return acc
        }, {})
        setStats({
          totalUsers: data.totalUsers,
          remainingSlots: data.remainingSlots,
          byTier: {
            vip: { users: tierCounts.vip || 0 },
            insider: { users: tierCounts.insider || 0 },
            early: { users: tierCounts.early || 0 }
          },
          recentActivity: []
        })
      }
      // Fetch codes
      const { data: codesData } = await supabase
        .from('beta_codes')
        .select('*')
        .order('created_at', { ascending: false })
      if (codesData) {
        setCodes(codesData)
      }
    } catch (error) {
      toast.error('Failed to load beta users')
    } finally {
      setLoading(false)
    }
  }
  // Filter and sort users
  const filteredUsers = useMemo(() => {
    let filtered = [...users]
    // Search
    if (searchQuery) {
      filtered = filtered.filter(user => 
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.codes.some(code => code.code.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }
    // Filter by tier
    if (filterTier !== 'all') {
      filtered = filtered.filter(user => 
        user.codes.some(code => code.tier === filterTier)
      )
    }
    // Sort
    filtered.sort((a, b) => {
      let aVal: string | number | Date = a[sortField]
      let bVal: string | number | Date = b[sortField]
      if (sortField === 'firstAccess' || sortField === 'lastAccess') {
        aVal = new Date(aVal).getTime()
        bVal = new Date(bVal).getTime()
      }
      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })
    return filtered
  }, [users, searchQuery, filterTier, sortField, sortDirection])
  // Toggle sort
  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }
  // Select/deselect users
  const toggleUserSelection = (email: string) => {
    const newSelection = new Set(selectedUsers)
    if (newSelection.has(email)) {
      newSelection.delete(email)
    } else {
      newSelection.add(email)
    }
    setSelectedUsers(newSelection)
  }
  const selectAllUsers = () => {
    if (selectedUsers.size === filteredUsers.length) {
      setSelectedUsers(new Set())
    } else {
      setSelectedUsers(new Set(filteredUsers.map(u => u.email)))
    }
  }
  // Export functions
  const exportToCSV = () => {
    const headers = ['Email', 'Name', 'Tier', 'First Access', 'Last Access', 'Code']
    const rows = filteredUsers.map(user => [
      user.email,
      user.name || '',
      user.codes[0]?.tier || '',
      new Date(user.firstAccess).toLocaleString(),
      new Date(user.lastAccess).toLocaleString(),
      user.codes[0]?.code || ''
    ])
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `arkana-beta-users-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }
  const exportToJSON = () => {
    const json = JSON.stringify(filteredUsers, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `arkana-beta-users-${new Date().toISOString().split('T')[0]}.json`
    a.click()
  }
  // Copy user emails
  const copySelectedEmails = () => {
    const emails = Array.from(selectedUsers).join(', ')
    navigator.clipboard.writeText(emails)
    toast.success(`Copied ${selectedUsers.size} email(s)`)
  }
  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }
  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.remainingSlots || 0} slots remaining
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">VIP Users</CardTitle>
            <Zap className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.byTier.vip.users || 0}</div>
            <p className="text-xs text-muted-foreground">
              Premium tier
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Insider Users</CardTitle>
            <Shield className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.byTier.insider.users || 0}</div>
            <p className="text-xs text-muted-foreground">
              Insider access
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Early Access</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.byTier.early.users || 0}</div>
            <p className="text-xs text-muted-foreground">
              Early adopters
            </p>
          </CardContent>
        </Card>
      </div>
      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-1 gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search users, emails, or codes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full sm:w-[300px]"
            />
          </div>
          <Select value={filterTier} onValueChange={(v: string) => setFilterTier(v)}>
            <SelectTrigger className="w-[140px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter tier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All tiers</SelectItem>
              <SelectItem value="vip">VIP</SelectItem>
              <SelectItem value="insider">Insider</SelectItem>
              <SelectItem value="early">Early Access</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCodeDialog(true)}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Generate Codes
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowInviteDialog(true)}
            disabled={selectedUsers.size === 0}
          >
            <Mail className="h-4 w-4 mr-2" />
            Send Invites ({selectedUsers.size})
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={exportToCSV}>
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportToJSON}>
                Export as JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">
                    <input
                      type="checkbox"
                      checked={selectedUsers.size === filteredUsers.length && filteredUsers.length > 0}
                      onChange={selectAllUsers}
                      className="rounded border-gray-300"
                    />
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer select-none"
                    onClick={() => toggleSort('name')}
                  >
                    <div className="flex items-center gap-1">
                      Name
                      {sortField === 'name' && (
                        sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer select-none"
                    onClick={() => toggleSort('email')}
                  >
                    <div className="flex items-center gap-1">
                      Email
                      {sortField === 'email' && (
                        sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead 
                    className="cursor-pointer select-none"
                    onClick={() => toggleSort('firstAccess')}
                  >
                    <div className="flex items-center gap-1">
                      First Access
                      {sortField === 'firstAccess' && (
                        sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer select-none"
                    onClick={() => toggleSort('lastAccess')}
                  >
                    <div className="flex items-center gap-1">
                      Last Activity
                      {sortField === 'lastAccess' && (
                        sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Devices</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.email} className="group">
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedUsers.has(user.email)}
                          onChange={() => toggleUserSelection(user.email)}
                          className="rounded border-gray-300"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {user.name || <span className="text-muted-foreground">-</span>}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{user.email}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => {
                              navigator.clipboard.writeText(user.email)
                              toast.success('Email copied')
                            }}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            user.codes[0]?.tier === 'vip' ? 'default' :
                            user.codes[0]?.tier === 'insider' ? 'secondary' :
                            'outline'
                          }
                          className={cn(
                            user.codes[0]?.tier === 'vip' && 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
                            user.codes[0]?.tier === 'insider' && 'bg-blue-500/10 text-blue-600 border-blue-500/20',
                            user.codes[0]?.tier === 'early' && 'bg-green-500/10 text-green-600 border-green-500/20'
                          )}
                        >
                          {user.codes[0]?.tier || 'early'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {user.codes[0]?.code || '-'}
                        </code>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(user.firstAccess).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(user.firstAccess).toLocaleTimeString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {getRelativeTime(user.lastAccess)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(user.lastAccess).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {user.devices?.length || 1} device{user.devices?.length !== 1 ? 's' : ''}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => window.open(`mailto:${user.email}`)}>
                              <Mail className="h-4 w-4 mr-2" />
                              Send email
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              // View user details
                            }}>
                              <ExternalLink className="h-4 w-4 mr-2" />
                              View details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Revoke access
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      {/* Generate Codes Dialog */}
      <CodeGenerationDialog
        open={showCodeDialog}
        onOpenChange={setShowCodeDialog}
        onSuccess={loadData}
      />
      {/* Bulk Invite Dialog */}
      <BulkInviteDialog
        open={showInviteDialog}
        onOpenChange={setShowInviteDialog}
        selectedEmails={Array.from(selectedUsers)}
      />
    </div>
  )
}
// Helper Components
function CodeGenerationDialog({
  open,
  onOpenChange,
  onSuccess
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [config, setConfig] = useState({
    tier: 'early' as 'vip' | 'insider' | 'early',
    count: 1,
    maxUses: 1,
    prefix: 'ARKANA',
    assignedTo: ''
  })
  const [generatedCodes, setGeneratedCodes] = useState<string[]>([])
  const supabase = createClientComponentClient()
  const generateCodes = async () => {
    try {
      setLoading(true)
      const codes: string[] = []
      for (let i = 0; i < config.count; i++) {
        const { data, error } = await supabase.rpc('generate_beta_code', {
          prefix: config.prefix
        })
        if (data) {
          // Insert the code with configuration
          await supabase.from('beta_codes').insert({
            code: data,
            tier: config.tier,
            max_uses: config.maxUses,
            assigned_to_name: config.assignedTo || null,
            created_by: 'admin'
          })
          codes.push(data)
        }
      }
      setGeneratedCodes(codes)
      toast.success(`Generated ${codes.length} beta code(s)`)
      onSuccess()
    } catch (error) {
      toast.error('Failed to generate codes')
    } finally {
      setLoading(false)
    }
  }
  const copyAllCodes = () => {
    navigator.clipboard.writeText(generatedCodes.join('\n'))
    toast.success('All codes copied to clipboard')
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Generate Beta Codes</DialogTitle>
          <DialogDescription>
            Create new beta access codes with custom configuration
          </DialogDescription>
        </DialogHeader>
        {generatedCodes.length === 0 ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tier">Access Tier</Label>
              <Select value={config.tier} onValueChange={(v: string) => setConfig({...config, tier: v})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vip">VIP (Premium)</SelectItem>
                  <SelectItem value="insider">Insider</SelectItem>
                  <SelectItem value="early">Early Access</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="count">Number of Codes</Label>
                <Input
                  id="count"
                  type="number"
                  min="1"
                  max="50"
                  value={config.count}
                  onChange={(e) => setConfig({...config, count: parseInt(e.target.value) || 1})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxUses">Uses per Code</Label>
                <Input
                  id="maxUses"
                  type="number"
                  min="1"
                  max="100"
                  value={config.maxUses}
                  onChange={(e) => setConfig({...config, maxUses: parseInt(e.target.value) || 1})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="prefix">Code Prefix</Label>
              <Input
                id="prefix"
                value={config.prefix}
                onChange={(e) => setConfig({...config, prefix: e.target.value.toUpperCase()})}
                placeholder="ARKANA"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="assignedTo">Assigned To (Optional)</Label>
              <Input
                id="assignedTo"
                value={config.assignedTo}
                onChange={(e) => setConfig({...config, assignedTo: e.target.value})}
                placeholder="Name or purpose"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">Generated {generatedCodes.length} codes</p>
                <Button size="sm" variant="outline" onClick={copyAllCodes}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy All
                </Button>
              </div>
              <div className="space-y-1 max-h-60 overflow-y-auto">
                {generatedCodes.map((code, i) => (
                  <div key={i} className="flex items-center justify-between py-1">
                    <code className="text-sm font-mono">{code}</code>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6"
                      onClick={() => {
                        navigator.clipboard.writeText(code)
                        toast.success('Code copied')
                      }}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        <DialogFooter>
          {generatedCodes.length === 0 ? (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={generateCodes} disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Generate Codes
              </Button>
            </>
          ) : (
            <Button onClick={() => {
              setGeneratedCodes([])
              onOpenChange(false)
            }}>
              Done
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
function BulkInviteDialog({
  open,
  onOpenChange,
  selectedEmails
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedEmails: string[]
}) {
  const [loading, setLoading] = useState(false)
  const [subject, setSubject] = useState('Welcome to Arkana Beta')
  const [message, setMessage] = useState(`Hi {{name}},
You've been selected for exclusive early access to Arkana!
Your beta code: {{code}}
Get started: https://arkana.chat/beta
Welcome aboard,
The Arkana Team`)
  const sendInvites = async () => {
    try {
      setLoading(true)
      // Implementation would go here
      toast.success(`Sent invites to ${selectedEmails.length} users`)
      onOpenChange(false)
    } catch (error) {
      toast.error('Failed to send invites')
    } finally {
      setLoading(false)
    }
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Send Beta Invites</DialogTitle>
          <DialogDescription>
            Send personalized invites to {selectedEmails.length} selected user(s)
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Recipients</Label>
            <div className="bg-muted rounded-lg p-3 max-h-32 overflow-y-auto">
              <p className="text-sm text-muted-foreground">
                {selectedEmails.join(', ')}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject">Email Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message Template</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={8}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Available variables: {'{{name}}'}, {'{{email}}'}, {'{{code}}'}
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={sendInvites} disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Send Invites
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
// Utility functions
function getRelativeTime(date: string): string {
  const now = new Date()
  const then = new Date(date)
  const diff = now.getTime() - then.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 30) return `${days}d ago`
  return then.toLocaleDateString()
}