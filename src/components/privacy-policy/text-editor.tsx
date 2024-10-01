import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useConfirm } from '@/hooks/use-confirm';

const formSchema = z.object({
  isEnabled: z.boolean().default(false),
  content: z.string().optional().refine((val) => !val || val.trim().length > 0, {
    message: "Content cannot be empty when enabled",
  }),
});

const PrivacyPolicyForm = () => {

  const [ConfirmDialogue, confirm] = useConfirm(
    "Reset Privacy Policy",
    "Are you sure you want to delete this content? This action cannot be undone."
  );

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isEnabled: false,
      content: '',
    },
  });

  const { isEnabled } = form.watch();

  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      [{ 'align': [] }],
    ],
  };

  const formats = [
    'bold', 'italic', 'underline',
    'list', 'bullet',
    'link', 'image',
    'align'
  ];

  const onSubmit = (data: any) => {
    const formData = {
      isEnabled: data.isEnabled,
      content: data.isEnabled ? [{ type: 'richText', value: data.content }] : [],
    };

    console.log('Formatted Form data:', JSON.stringify(formData, null, 2));


  };

  const handleReset = async () => {
    const ok = await confirm();
    if (ok) {
      form.reset({
        isEnabled: false,
        content: '',
      });
    }
  };

  return (
    <>
      <ConfirmDialogue />
      <div className='w-full h-full bg-white rounded-xl min-h-screen'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full mx-auto p-6">
            <FormField
              control={form.control}
              name="isEnabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Privacy Policy</FormLabel>
                    <FormDescription>
                      Enable or disable the privacy policy on the frontend
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <ReactQuill
                      theme="snow"
                      value={field.value}
                      onChange={field.onChange}
                      modules={modules}
                      formats={formats}
                      className="h-80"
                      readOnly={!isEnabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='w-full flex items-center justify-end pt-14 gap-5'>
              <Button type="button" onClick={handleReset} variant="outline" className="bg-gray-200">
                Reset
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

export default PrivacyPolicyForm;
