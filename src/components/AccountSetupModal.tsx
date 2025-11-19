import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
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
import { submitUserAccountInfo, fetchAccountInfo } from '@/services/profileService';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import PageLoader from './PageLoader';
import { useNavigate } from 'react-router';
import type { AxiosError } from 'axios';


type AccountSetupModalProps = {
  open: boolean;
  onClose: () => void;
};

const AccountSetupModal = ({ open, onClose }: AccountSetupModalProps) => {
    //   const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();



    const onAccountInfoSubmit = (data: AccountInfoFormData) => {
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
    
    const { data: accountData, isLoading } = useQuery({
        queryKey: ['profileAccountInfo'],
        queryFn: fetchAccountInfo,
      });
    
    const form = useForm<AccountInfoFormData>({
      resolver: zodResolver(accountInfoSchema),
      defaultValues: {
        bank_name: accountData?.bank_name || "",
        account_number: accountData?.account_number || "",
        account_name: accountData?.account_name || "",
      },
    });

    useEffect(() => {
      if (accountData) {
        form.reset({
          bank_name: accountData.bank_name || "",
          account_number: accountData.account_number || "",
          account_name: accountData.account_name || "",
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
          <DialogHeader>
            <DialogTitle>Set Up Your Bank Account</DialogTitle>
            <DialogDescription>
              Please provide your bank account details to proceed.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onAccountInfoSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="bank_name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Bank Name" {...field} />
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
                      <Input placeholder="Account Number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="account_name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Account Name (Optional)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button 
                type="submit" 
                disabled={verifyAccountInfoSubmit.isPending}
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