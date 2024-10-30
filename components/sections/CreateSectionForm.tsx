"use client"

import { Course, Section } from "@prisma/client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import toast from "react-hot-toast";
import axios from "axios";
import SectionList from "@/components/sections/SectionList";

const formSchema = z.object({
    title: z.string().min(2, {
        message: "Title is required and must be at least 2 characters long"
    }),
})

const CreateSectionForm = ({
    course,
}: {
    course: Course & { sections: Section[] };
}) => {
    const pathname = usePathname();
    const router = useRouter();
    const routes = [
        {
            label: "Thông tin cơ bản",
            path: `/instructor/courses/${course.id}/basic`,
        },
        { label: "Bài học", path: `/instructor/courses/${course.id}/sections` },
        { label: "Câu hỏi trắc nghiệm", path: `/instructor/courses/${course.id}/quiz` },
    ];

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.post(
                `/api/courses/${course.id}/sections`,
                values
            );
            router.push(
                `/instructor/courses/${course.id}/sections/${response.data.id}`
            );
            toast.success("Tạo bài học thành công!");
        } catch (err) {
            toast.error("Something went wrong!");
            console.log("Failed to create a new section", err);
        }
    };

    const onReorder = async (updateData: { id: string; position: number }[]) => {
        try {
          await axios.put(`/api/courses/${course.id}/sections/reorder`, {
            list: updateData,
          });
        } catch (err) {
          console.log("Failed to reorder sections", err);
          toast.error("Something went wrong!");
        }
      };

    return (
        <div className="px-10 py-6">
            <div className="flex gap-5">
                {routes.map((route) => (
                    <Link key={route.path} href={route.path}>
                        <Button variant={pathname === route.path ? "default" : "outline"}>
                            {route.label}
                        </Button>
                    </Link>
                ))}
            </div>

            <SectionList
                items={course.sections || []}
                onReorder={onReorder}
                onEdit={(id) =>
                    router.push(`/instructor/courses/${course.id}/sections/${id}`)
                }
            />

            <h1 className="text-xl font-bold mt-5">Tạo một bài học mới</h1>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-5">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tiêu đề</FormLabel>
                                <FormControl>
                                    <Input placeholder="vd: Nhập môn" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex gap-5">
                        <Link href="/instructor/courses">
                            <Button variant="outline" type="button">
                                Hủy
                            </Button>
                        </Link>
                        <Button type="submit">
                            Tạo bài học
                        </Button>
                    </div>
                </form>
            </Form>

        </div>
    )
}

export default CreateSectionForm