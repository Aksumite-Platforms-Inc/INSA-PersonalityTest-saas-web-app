// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { PageTitle } from "@/components/page-title";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   ArrowLeft,
//   Mail,
//   Phone,
//   Calendar,
//   Building,
//   Briefcase,
//   Clock,
// } from "lucide-react";
// import { Badge } from "@/components/ui/badge";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { PersonalityChart } from "@/components/employee/personality-chart";

// // Mock data for employees by organization
// const employeesByOrganization = {
//   "1": [
//     {
//       id: "101",
//       name: "Abebe Kebede",
//       email: "abebe.k@moe.gov.et",
//       phone: "+251-911-123456",
//       branch: "Headquarters",
//       department: "Administration",
//       position: "Director",
//       status: "active",
//       joinDate: "2020-03-15",
//       testsCompleted: 3,
//       lastActive: "2023-06-15",
//       personalityType: "ENTJ",
//       personalityTraits: {
//         extraversion: 85,
//         agreeableness: 65,
//         conscientiousness: 90,
//         neuroticism: 30,
//         openness: 75,
//       },
//       testResults: [
//         {
//           id: "test1",
//           name: "Leadership Assessment",
//           date: "2023-05-10",
//           score: 92,
//           status: "completed",
//         },
//         {
//           id: "test2",
//           name: "Communication Skills",
//           date: "2023-04-22",
//           score: 88,
//           status: "completed",
//         },
//         {
//           id: "test3",
//           name: "Conflict Resolution",
//           date: "2023-03-15",
//           score: 85,
//           status: "completed",
//         },
//       ],
//     },
//     // Other employees...
//   ],
//   // Other organizations...
// };

// export default function EmployeeDetailsPage({
//   params,
// }: {
//   params: { orgId: string; id: string };
// }) {
//   const router = useRouter();
//   const [activeTab, setActiveTab] = useState("profile");

//   const organizationId = params.orgId;
//   const employeeId = params.id;

//   // Find the employee
//   const employees =
//     employeesByOrganization[
//       organizationId as keyof typeof employeesByOrganization
//     ] || [];
//   const employee = employees.find((emp) => emp.id === employeeId);

//   if (!employee) {
//     return (
//       <div className="flex items-center justify-center h-full">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold">Employee not found</h2>
//           <p className="text-muted-foreground mt-2">
//             The employee you are looking for does not exist.
//           </p>
//           <Button className="mt-4" onClick={() => router.back()}>
//             Go Back
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   // Function to render status badge with appropriate variant
//   const renderStatusBadge = (status: string) => {
//     switch (status) {
//       case "active":
//         return (
//           <Badge
//             variant="outline"
//             className="bg-green-50 text-green-700 border-green-200"
//           >
//             Active
//           </Badge>
//         );
//       case "inactive":
//         return (
//           <Badge
//             variant="outline"
//             className="bg-red-50 text-red-700 border-red-200"
//           >
//             Inactive
//           </Badge>
//         );
//       case "pending":
//         return (
//           <Badge
//             variant="outline"
//             className="bg-yellow-50 text-yellow-700 border-yellow-200"
//           >
//             Pending
//           </Badge>
//         );
//       default:
//         return <Badge variant="outline">{status}</Badge>;
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <PageTitle title={employee.name} description={employee.position} />
//         <Button variant="outline" onClick={() => router.back()}>
//           <ArrowLeft className="mr-2 h-4 w-4" />
//           Back
//         </Button>
//       </div>

//       <div className="flex flex-col md:flex-row gap-6">
//         <Card className="md:w-1/3">
//           <CardHeader>
//             <div className="flex items-center justify-between">
//               <CardTitle>Profile</CardTitle>
//               {renderStatusBadge(employee.status)}
//             </div>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             <div className="flex flex-col items-center space-y-4">
//               <Avatar className="h-24 w-24">
//                 <AvatarImage
//                   src={`https://api.dicebear.com/7.x/initials/svg?seed=${employee.name}`}
//                 />
//                 <AvatarFallback>
//                   {employee.name
//                     .split(" ")
//                     .map((n) => n[0])
//                     .join("")}
//                 </AvatarFallback>
//               </Avatar>
//               <div className="text-center">
//                 <h3 className="text-lg font-medium">{employee.name}</h3>
//                 <p className="text-sm text-muted-foreground">
//                   {employee.position}
//                 </p>
//               </div>
//             </div>

//             <div className="space-y-4">
//               <div className="flex items-center">
//                 <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
//                 <span className="text-sm">{employee.email}</span>
//               </div>
//               <div className="flex items-center">
//                 <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
//                 <span className="text-sm">{employee.phone}</span>
//               </div>
//               <div className="flex items-center">
//                 <Building className="mr-2 h-4 w-4 text-muted-foreground" />
//                 <span className="text-sm">{employee.branch}</span>
//               </div>
//               <div className="flex items-center">
//                 <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
//                 <span className="text-sm">{employee.department}</span>
//               </div>
//               <div className="flex items-center">
//                 <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
//                 <span className="text-sm">
//                   Joined {new Date(employee.joinDate).toLocaleDateString()}
//                 </span>
//               </div>
//               <div className="flex items-center">
//                 <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
//                 <span className="text-sm">
//                   Last active{" "}
//                   {new Date(employee.lastActive).toLocaleDateString()}
//                 </span>
//               </div>
//             </div>

//             <div className="pt-4 border-t">
//               <h4 className="text-sm font-medium mb-2">Personality Type</h4>
//               <div className="flex items-center justify-between">
//                 <Badge variant="secondary" className="text-lg font-bold">
//                   {employee.personalityType}
//                 </Badge>
//                 <span className="text-sm text-muted-foreground">
//                   {employee.testsCompleted} tests completed
//                 </span>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <div className="flex-1 space-y-6">
//           <Tabs defaultValue="personality" className="w-full">
//             <TabsList className="w-full">
//               <TabsTrigger value="personality" className="flex-1">
//                 Personality Profile
//               </TabsTrigger>
//               <TabsTrigger value="tests" className="flex-1">
//                 Test Results
//               </TabsTrigger>
//               <TabsTrigger value="documents" className="flex-1">
//                 Documents
//               </TabsTrigger>
//             </TabsList>

//             <TabsContent value="personality" className="space-y-4 mt-6">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Personality Traits</CardTitle>
//                   <CardDescription>
//                     Based on completed personality assessments
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent className="h-[400px]">
//                   <PersonalityChart data={employee.personalityTraits} />
//                 </CardContent>
//               </Card>
//             </TabsContent>

//             <TabsContent value="tests" className="space-y-4 mt-6">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Test Results</CardTitle>
//                   <CardDescription>
//                     History of completed assessments
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-4">
//                     {employee.testResults.map((test) => (
//                       <div
//                         key={test.id}
//                         className="flex items-center justify-between p-4 border rounded-lg"
//                       >
//                         <div>
//                           <h4 className="font-medium">{test.name}</h4>
//                           <p className="text-sm text-muted-foreground">
//                             Completed on{" "}
//                             {new Date(test.date).toLocaleDateString()}
//                           </p>
//                         </div>
//                         <div className="flex items-center space-x-4">
//                           <div className="text-right">
//                             <span className="text-2xl font-bold">
//                               {test.score}%
//                             </span>
//                             <p className="text-xs text-muted-foreground">
//                               Score
//                             </p>
//                           </div>
//                           <Button variant="outline" size="sm">
//                             View Details
//                           </Button>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>
//             </TabsContent>

//             <TabsContent value="documents" className="space-y-4 mt-6">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Documents</CardTitle>
//                   <CardDescription>
//                     Documents shared with this employee
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <p className="text-muted-foreground">
//                     No documents have been shared with this employee yet.
//                   </p>
//                 </CardContent>
//               </Card>
//             </TabsContent>
//           </Tabs>
//         </div>
//       </div>
//     </div>
//   );
// }
