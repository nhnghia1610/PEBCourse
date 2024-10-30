"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

const formSchema = z.object({
    questions: z.array(z.object({
        questionText: z.string().min(1, { message: "Question is required" }),
        options: z.array(z.object({
            optionText: z.string().min(1, { message: "Option is required" }),
        })).min(2, { message: "At least 2 options are required" }),
        correctAnswer: z.string().min(1, { message: "Correct answer is required" }),
    })).min(1, { message: "At least one question is required" }),
});

const CreateQuizForm = () => {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            questions: [{ questionText: "", options: [{ optionText: "" }, { optionText: "" }], correctAnswer: "" }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "questions",
    });

    const onSubmit = async (values) => {
        try {
            await axios.post("/api/quizzes", values);
            toast.success("Quiz created successfully");
            form.reset();
        } catch (err) {
            console.log("Failed to create quiz", err);
            toast.error("Something went wrong!");
        }
    };

    return (
        <div className="p-10">
            <h1 className="text-2xl font-bold mb-6">Create Your Quiz</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {fields.map((field, index) => (
                        <div key={field.id} className="border border-gray-300 rounded-lg p-6 shadow-sm space-y-4">
                            <FormField
                                control={form.control}
                                name={`questions.${index}.questionText`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-semibold">Question {index + 1}</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter question" {...field} className="border border-gray-400 rounded-md p-2" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="space-y-2">
                                <h3 className="font-bold">Options:</h3>
                                {field.options.map((option, optionIndex) => (
                                    <FormField
                                        key={optionIndex}
                                        control={form.control}
                                        name={`questions.${index}.options.${optionIndex}.optionText`}
                                        render={({ field }) => (
                                            <FormItem className="flex items-center space-x-2">
                                                <FormControl>
                                                    <Input placeholder={`Option ${optionIndex + 1}`} {...field} className="border border-gray-400 rounded-md p-2" />
                                                </FormControl>
                                                {optionIndex > 1 && (
                                                    <Button type="button" onClick={() => removeOption(index, optionIndex)} className="bg-red-500 hover:bg-red-600 text-white">
                                                        Remove
                                                    </Button>
                                                )}
                                            </FormItem>
                                        )}
                                    />
                                ))}
                                <Button 
                                    type="button" 
                                    onClick={() => append({ optionText: "" })} 
                                    className="bg-blue-500 hover:bg-blue-600 text-white"
                                >
                                    + Add Option
                                </Button>
                            </div>

                            <FormField
                                control={form.control}
                                name={`questions.${index}.correctAnswer`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-semibold">Correct Answer</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter correct answer" {...field} className="border border-gray-400 rounded-md p-2" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="button" onClick={() => remove(index)} className="bg-red-500 hover:bg-red-600 text-white">
                                Remove Question
                            </Button>
                        </div>
                    ))}

                    <Button type="button" onClick={() => append({ questionText: "", options: [{ optionText: "" }, { optionText: "" }], correctAnswer: "" })} className="bg-green-500 hover:bg-green-600 text-white">
                        + Add Question
                    </Button>

                    <Button type="submit" className="mt-4 bg-indigo-500 hover:bg-indigo-600 text-white">Submit Quiz</Button>
                </form>
            </Form>
        </div>
    );
};

export default CreateQuizForm;
