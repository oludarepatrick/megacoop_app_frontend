import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { toast } from "sonner"
import { accountInfoSchema, type AccountInfoFormData  } from '@/schemas/profileSchema';
import { submitUserAccountInfo } from '@/services/profileService';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import PageLoader from './PageLoader';
import { useNavigate } from 'react-router';
import type { AxiosError } from 'axios';
import { Landmark } from 'lucide-react';
import { useAccountInfo } from '@/hooks/useProfile';


type AccountSetupModalProps = {
  open: boolean;
  onClose: () => void;
};

const AccountSetupModal = ({ open, onClose }: AccountSetupModalProps) => {
    //   const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

  const onAccountInfoSubmit = (data: AccountInfoFormData) => {
    // destructure and submit only bank_name and account_number
    // const { bank_name, account_number } = data;
    // const submitData = { bank_name, account_number };
    console.log("Account Info Submitted:", data);
    verifyAccountInfoSubmit.mutate(data);
  };

    const verifyAccountInfoSubmit = (useMutation({
        mutationFn: submitUserAccountInfo,
        onSuccess: () => {
            // toast.success("Account information submitted successfully");
            toast("Account information submitted successfully", {
                description: `Your bank account has been set up successfully.`,
                action: {
                    label: 'View Profile',
                    onClick: () => {
                        /* Optional action on click */
                        navigate('/profile');
                    },
                },
             })
            onClose();
        },
        onError: (err: AxiosError<{ message: string }>) => {
          const message = err?.response?.data?.message ?? err?.message ?? "Failed to submit account information";
            toast.error(message);
        },
    }));
    
    const { data: accountData, isLoading } = useAccountInfo();

    const form = useForm<AccountInfoFormData>({
      resolver: zodResolver(accountInfoSchema),
      defaultValues: {
        bank_name: accountData?.[0]?.bank_name || "",
        account_number: accountData?.[0]?.account_number || "",
        account_holder_name: accountData?.[0]?.account_holder_name || "",
      },
    });

    useEffect(() => {
      if (accountData) {
        form.reset({
          bank_name: accountData[0].bank_name || "",
          account_number: accountData[0].account_number || "",
          account_holder_name: accountData[0].account_holder_name || "",
        });
      }
    }, [accountData, form]);

    // const onSubmit = async (data: AccountInfoFormData) => {
    //   setIsSubmitting(true);
    //   try {
    //     await submitUserAccountInfo(data);
    //     toast.success("Account information updated successfully");
    //     onClose();
    //   } catch (error: any) {
    //     toast.error(error?.response?.data?.message || "Failed to update account information");
    //   } finally {
    //     setIsSubmitting(false);
    //   }
    // };

    if (isLoading) {
      return <PageLoader />;
    }

    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader className="items-center">
            <DialogTitle className='text-megagreen flex flex-col items-center gap-3'>
              <Landmark/>
              Add your Bank Details
              </DialogTitle>
            <DialogDescription className="text-megagreen" >
              Please provide your bank account details to proceed.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onAccountInfoSubmit)} className="space-y-4 max-w-sm mx-auto w-full">
              <FormField
                control={form.control}
                name="bank_name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Bank Name" {...field} className='focus:!outline-none focus:!ring-1 focus:!ring-megagreen focus:!shadow-lg'/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="account_number"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Account Number"
                        {...field}
                        type='number'
                        className='focus:!outline-none focus:!ring-1 focus:!ring-megagreen focus:!shadow-lg'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* {accountData?.account_name && ( */}
                <FormField
                control={form.control}
                name="account_holder_name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Account Name (Optional)" {...field} className='focus:!outline-none focus:!ring-1 focus:!ring-megagreen focus:!shadow-lg'/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                />
              {/* )} */}
              <DialogFooter>
                <Button 
                type="submit" 
                disabled={verifyAccountInfoSubmit.isPending}
                className='bg-megagreen hover:bg-megagreen/80'
                >
                  {verifyAccountInfoSubmit.isPending ? 'Submitting...' : 'Submit'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
};

export default AccountSetupModal;