"use client";

import { useEffect, useState } from "react";
import { adminService, UsersFilters } from "@/services/adminService";
import { User } from "@/types/user";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Filter, X } from "lucide-react";

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<UsersFilters>({
        page: 1,
        limit: 20
    });
    const [searchInput, setSearchInput] = useState("");
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchUsers();
    }, [filters]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await adminService.getUsers(filters);
            if (response.success && response.data && Array.isArray(response.data.users)) {
                setUsers(response.data.users);
                setTotalUsers(response.data.pagination.total);
                setTotalPages(response.data.pagination.pages);
            } else {
                console.error("API Error: Expected users array but got:", response);
                 setUsers([]);
                 toast.error("Invalid data format received from server");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while fetching users");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setFilters(prev => ({ ...prev, search: searchInput, page: 1 }));
    };

    const handleFilterChange = (key: keyof UsersFilters, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
    };

    const clearFilters = () => {
        setFilters({ page: 1, limit: 20 });
        setSearchInput("");
    };

    const handleVerifyUser = async (userId: string, isVerified: boolean) => {
        try {
            const response = await adminService.verifyUser(userId, isVerified);
            if (response.success) {
                toast.success(response.message || `User ${isVerified ? 'verified' : 'unverified'} successfully`);
                // Update the user in the local state
                setUsers(prevUsers => 
                    prevUsers.map(user => 
                        user._id === userId ? { ...user, isVerified } : user
                    )
                );
            } else {
                toast.error(response.message || "Failed to update user verification");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while updating user verification");
        }
    };

    const hasActiveFilters = filters.role || filters.isActive !== undefined || filters.isVerified !== undefined || filters.search;

    if (loading && users.length === 0) {
        return <div className="p-6 space-y-4">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-[400px] w-full" />
        </div>
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Users Management</h1>
                    <p className="text-muted-foreground mt-1">Total Users: {totalUsers}</p>
                </div>
            </div>

            {/* Filters Section */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5" />
                            <CardTitle>Filters</CardTitle>
                        </div>
                        {hasActiveFilters && (
                            <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-2">
                                <X className="w-4 h-4" />
                                Clear Filters
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="flex gap-2 lg:col-span-2">
                            <Input
                                placeholder="Search by email..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                className="flex-1"
                            />
                            <Button onClick={handleSearch} size="icon">
                                <Search className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* Role Filter */}
                        <Select
                            value={filters.role || "all"}
                            onValueChange={(value) => handleFilterChange('role', value === 'all' ? undefined : value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Roles</SelectItem>
                                <SelectItem value="talent">Talent</SelectItem>
                                <SelectItem value="client">Client</SelectItem>
                                <SelectItem value="recruiter">Recruiter</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Status Filters */}
                        <Select
                            value={
                                filters.isActive === true ? "active" :
                                filters.isActive === false ? "inactive" : "all"
                            }
                            onValueChange={(value) => 
                                handleFilterChange('isActive', value === 'all' ? undefined : value === 'active')
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Verification Filter */}
                        <Select
                            value={
                                filters.isVerified === true ? "verified" :
                                filters.isVerified === false ? "unverified" : "all"
                            }
                            onValueChange={(value) => 
                                handleFilterChange('isVerified', value === 'all' ? undefined : value === 'verified')
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by verification" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Verification</SelectItem>
                                <SelectItem value="verified">Verified</SelectItem>
                                <SelectItem value="unverified">Unverified</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Users Table */}
            <Card>
                <CardHeader>
                    <CardTitle>All Users</CardTitle>
                    <CardDescription>
                        {hasActiveFilters ? `Showing filtered results (${users.length} of ${totalUsers})` : `Manage and view all registered users`}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 text-muted-foreground font-medium">
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th className="h-12 px-4 align-middle">User</th>
                                    <th className="h-12 px-4 align-middle">Role</th>
                                    <th className="h-12 px-4 align-middle">Status</th>
                                    <th className="h-12 px-4 align-middle">Joined</th>
                                    <th className="h-12 px-4 align-middle">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user._id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <td className="p-4 align-middle">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9">
                                                    <AvatarImage src={user.avatar} alt={user.email} />
                                                    <AvatarFallback>{user.email[0].toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{user.email}</span>
                                                    <span className="text-xs text-muted-foreground font-mono">{user._id}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle">
                                            <Badge variant={user.role === 'admin' ? 'destructive' : user.role === 'client' ? 'default' : 'secondary'} className="capitalize">
                                                {user.role}
                                            </Badge>
                                        </td>
                                        <td className="p-4 align-middle">
                                            <div className="flex items-center gap-2">
                                                {user.isActive ? (
                                                    <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20">Active</Badge>
                                                ) : (
                                                    <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20 hover:bg-red-500/20">Inactive</Badge>
                                                )}
                                                {user.isVerified ? (
                                                     <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/20">Verified</Badge>
                                                ) : (
                                                    <Badge variant="outline" className="text-muted-foreground">Unverified</Badge>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle">
                                            {format(new Date(user.createdAt), "MMM d, yyyy")}
                                        </td>
                                        <td className="p-4 align-middle">
                                            <Button
                                                variant={user.isVerified ? "outline" : "default"}
                                                size="sm"
                                                onClick={() => handleVerifyUser(user._id, !user.isVerified)}
                                                disabled={loading}
                                                className={user.isVerified ? "" : "bg-blue-600 hover:bg-blue-700"}
                                            >
                                                {user.isVerified ? "Unverify" : "Verify"}
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {users.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                            {hasActiveFilters ? "No users found matching the filters." : "No users found."}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-4">
                            <p className="text-sm text-muted-foreground">
                                Page {filters.page} of {totalPages}
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleFilterChange('page', (filters.page || 1) - 1)}
                                    disabled={filters.page === 1}
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleFilterChange('page', (filters.page || 1) + 1)}
                                    disabled={filters.page === totalPages}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
