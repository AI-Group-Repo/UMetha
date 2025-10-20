"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import Link from "next/link";
import {
  Search,
  Filter,
  Plus,
  FileDown,
  Trash2,
  MoreHorizontal,
  UserCog,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  Lock,
  Mail,
  RefreshCcw,
  User,
  Check,
  Shield,
  Ban,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock user data - in a real app this would come from an API
const mockUsers = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    role: "INFLUENCER",
    status: "ACTIVE",
    verified: true,
    orders: 12,
    spent: 1245.99,
    joined: "2025-04-14",
    lastActive: "2025-04-16",
  },
  {
    id: "2",
    name: "Michael Rodriguez",
    email: "m.rodriguez@example.com",
    role: "SELLER",
    status: "ACTIVE",
    verified: true,
    orders: 8,
    spent: 789.45,
    joined: "2025-04-13",
    lastActive: "2025-04-15",
  },
  {
    id: "3",
    name: "Emma Thompson",
    email: "emma.t@example.com",
    role: "USER",
    status: "ACTIVE",
    verified: true,
    orders: 5,
    spent: 356.2,
    joined: "2025-04-12",
    lastActive: "2025-04-16",
  },
  {
    id: "4",
    name: "Alex Parker",
    email: "alex.p@example.com",
    role: "ADMIN",
    status: "ACTIVE",
    verified: true,
    orders: 0,
    spent: 0,
    joined: "2025-04-10",
    lastActive: "2025-04-16",
  },
  {
    id: "5",
    name: "Jessica Williams",
    email: "j.williams@example.com",
    role: "SELLER",
    status: "INACTIVE",
    verified: true,
    orders: 18,
    spent: 2567.3,
    joined: "2025-03-25",
    lastActive: "2025-04-05",
  },
  {
    id: "6",
    name: "David Garcia",
    email: "d.garcia@example.com",
    role: "USER",
    status: "SUSPENDED",
    verified: false,
    orders: 2,
    spent: 87.5,
    joined: "2025-04-08",
    lastActive: "2025-04-09",
  },
  {
    id: "7",
    name: "Linda Martinez",
    email: "l.martinez@example.com",
    role: "USER",
    status: "ACTIVE",
    verified: true,
    orders: 9,
    spent: 652.75,
    joined: "2025-03-30",
    lastActive: "2025-04-15",
  },
  {
    id: "8",
    name: "Robert Wilson",
    email: "r.wilson@example.com",
    role: "INFLUENCER",
    status: "PENDING",
    verified: false,
    orders: 0,
    spent: 0,
    joined: "2025-04-15",
    lastActive: "2025-04-15",
  },
];

export default function UsersManagement() {
  const { user, userRole, isLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<string | null>("joined");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // For demo pagination
  const USERS_PER_PAGE = 5;

  // Check for proper admin authorization
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/signin");
        return;
      }

      // Verify the user is an admin
      if (!userRole || userRole.toUpperCase() !== "ADMIN") {
        router.push("/dashboard");
        return;
      }

      setLoading(false);
    }
  }, [user, userRole, isLoading, router]);

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Filter and sort users
  const filteredUsers = mockUsers
    .filter((user) => {
      const matchesSearch =
        searchTerm === "" ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = roleFilter === null || user.role === roleFilter;
      const matchesStatus =
        statusFilter === null || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    })
    .sort((a, b) => {
      if (!sortField) return 0;

      const fieldA = a[sortField as keyof typeof a];
      const fieldB = b[sortField as keyof typeof b];

      if (typeof fieldA === "string" && typeof fieldB === "string") {
        return sortDirection === "asc"
          ? fieldA.localeCompare(fieldB)
          : fieldB.localeCompare(fieldA);
      }

      if (typeof fieldA === "number" && typeof fieldB === "number") {
        return sortDirection === "asc" ? fieldA - fieldB : fieldB - fieldA;
      }

      return 0;
    });

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const startIndex = (currentPage - 1) * USERS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + USERS_PER_PAGE
  );

  // Handle checkbox changes
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(paginatedUsers.map((user) => user.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectUser = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
      setSelectAll(false);
    } else {
      setSelectedUsers([...selectedUsers, userId]);
      if (selectedUsers.length + 1 === paginatedUsers.length) {
        setSelectAll(true);
      }
    }
  };

  // Bulk actions
  const handleBulkDelete = () => {
    // In a real app, you would call an API to delete the selected users
    console.log("Deleting users:", selectedUsers);
    setShowDeleteConfirm(false);
    setSelectedUsers([]);
    setSelectAll(false);
    // After deletion, you might fetch the updated list from the server
  };

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="animate-spin h-12 w-12 rounded-full border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
            User Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            View, search, and manage all users in the platform
          </p>
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-indigo-500 to-violet-500 text-white hover:from-indigo-600 hover:to-violet-600 border-none">
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Create a new user account in the system.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium">
                      First Name
                    </label>
                    <Input id="firstName" placeholder="Enter first name" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium">
                      Last Name
                    </label>
                    <Input id="lastName" placeholder="Enter last name" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="role" className="text-sm font-medium">
                    Role
                  </label>
                  <Select defaultValue="USER">
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="SELLER">Seller</SelectItem>
                      <SelectItem value="INFLUENCER">Influencer</SelectItem>
                      <SelectItem value="USER">User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Create User</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="outline">
            <FileDown className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6 border border-gray-200 dark:border-gray-800 shadow-sm">
        <CardContent className="p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-5 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="md:col-span-2">
              <Select
                value={roleFilter || ""}
                onValueChange={(value) => setRoleFilter(value || null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Roles</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="SELLER">Seller</SelectItem>
                  <SelectItem value="INFLUENCER">Influencer</SelectItem>
                  <SelectItem value="USER">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Select
                value={statusFilter || ""}
                onValueChange={(value) => setStatusFilter(value || null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Status</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="SUSPENDED">Suspended</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-3 flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setRoleFilter(null);
                  setStatusFilter(null);
                  setSortField("joined");
                  setSortDirection("desc");
                  setCurrentPage(1);
                }}
                className="flex-1"
              >
                <RefreshCcw className="mr-2 h-4 w-4" />
                Reset Filters
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                disabled={selectedUsers.length === 0}
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete ({selectedUsers.length})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[40px]">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      checked={selectAll}
                      onChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center">
                      <span>Name</span>
                      {sortField === "name" && (
                        <span className="ml-1">
                          {sortDirection === "asc" ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("orders")}
                  >
                    <div className="flex items-center">
                      <span>Orders</span>
                      {sortField === "orders" && (
                        <span className="ml-1">
                          {sortDirection === "asc" ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("spent")}
                  >
                    <div className="flex items-center">
                      <span>Spent</span>
                      {sortField === "spent" && (
                        <span className="ml-1">
                          {sortDirection === "asc" ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("joined")}
                  >
                    <div className="flex items-center">
                      <span>Joined</span>
                      {sortField === "joined" && (
                        <span className="ml-1">
                          {sortDirection === "asc" ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => handleSelectUser(user.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-300">
                            <User className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground">
                              ID: {user.id}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.email}
                        {user.verified && (
                          <span className="ml-1 text-blue-500 dark:text-blue-400">
                            <Check className="inline-block h-3 w-3" />
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`
                            ${
                              user.role === "ADMIN"
                                ? "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400"
                                : user.role === "SELLER"
                                ? "bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400"
                                : user.role === "INFLUENCER"
                                ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400"
                                : "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                            }
                          `}
                        >
                          {user.role.charAt(0) +
                            user.role.slice(1).toLowerCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`
                            ${
                              user.status === "ACTIVE"
                                ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                                : user.status === "INACTIVE"
                                ? "bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400"
                                : user.status === "SUSPENDED"
                                ? "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                                : "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                            }
                          `}
                        >
                          {user.status.charAt(0) +
                            user.status.slice(1).toLowerCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.orders}</TableCell>
                      <TableCell>${user.spent.toFixed(2)}</TableCell>
                      <TableCell>{formatDate(user.joined)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-[160px]"
                          >
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <UserCog className="mr-2 h-4 w-4" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <ShoppingBag className="mr-2 h-4 w-4" />
                              View Orders
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Mail className="mr-2 h-4 w-4" />
                              Send Email
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Lock className="mr-2 h-4 w-4" />
                              Reset Password
                            </DropdownMenuItem>
                            {user.status !== "SUSPENDED" ? (
                              <DropdownMenuItem>
                                <Ban className="mr-2 h-4 w-4 text-red-500" />
                                <span className="text-red-500">Suspend</span>
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem>
                                <Shield className="mr-2 h-4 w-4 text-green-500" />
                                <span className="text-green-500">
                                  Reactivate
                                </span>
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <div className="flex flex-col items-center">
                        <UserCog className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-2" />
                        <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                          No users found
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Try adjusting your search or filter to find what
                          you're looking for.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {filteredUsers.length > 0 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
            <span className="font-medium">
              {Math.min(startIndex + USERS_PER_PAGE, filteredUsers.length)}
            </span>{" "}
            of <span className="font-medium">{filteredUsers.length}</span> users
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant="outline"
                size="sm"
                className={
                  currentPage === page
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400"
                    : ""
                }
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedUsers.length} user
              {selectedUsers.length !== 1 ? "s" : ""}? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleBulkDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
