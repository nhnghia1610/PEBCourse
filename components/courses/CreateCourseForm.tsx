"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import axios from "axios"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ComboBox } from "../custom/ComboBox"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"


const formSchema = z.object({
    title: z.string().min(2, { message: "Title is required and minimum 2 characters" }),
    categoryId: z.string().min(1, { message: "Category is required" }),
    subCategoryId: z.string().min(1, { message: "Sub Category is required" }),
})

interface CreateCourseFormProps {
    categories: {
        label: string
        value: string
        subCategories: { label: string, value: string }[]
    }[];
}

const CreateCourseForm = ({ categories }: CreateCourseFormProps) => {
    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            categoryId: "",
            subCategoryId: ""
        }
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.post("/api/courses", values)
            router.push(`/instructor/courses/${response.data.id}/basic`)
            toast.success("Tạo khóa học thành công")
        } catch (err) {
            console.log("Tạo khóa học thất bại", err)
            toast.error("Something went wrong!")
        }
    }

    return (
        <div className="p-10">
            <h1 className="text-xl font-bold">Đầu tiên hãy cung cấp cho chúng tôi một số thông tin cơ bản cho khóa học...</h1>
            <p className="text-sm mt-3">Bạn có thể thay đổi các mục này sau nên đừng lo nhé!</p>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-10">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tiêu đề khóa học</FormLabel>
                                <FormControl>
                                    <Input placeholder="vd: Quản trị kinh doanh cấp tốc" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="categoryId"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Danh mục</FormLabel>
                                <FormControl>
                                    <ComboBox options={categories} {...field}></ComboBox>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="subCategoryId"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Danh mục con</FormLabel>
                                <FormControl>
                                    <ComboBox options={
                                        categories.find(
                                            (category) =>
                                                category.value === form.watch("categoryId")
                                        )?.subCategories || []
                                    }
                                        {...field}></ComboBox>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    
                    <Button type="submit">Tạo khóa học</Button>
                </form>
            </Form>
        </div>
    )
}

export default CreateCourseForm