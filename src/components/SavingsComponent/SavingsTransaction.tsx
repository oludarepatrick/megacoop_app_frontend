import { Card, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";
import { Link } from "react-router-dom";
import { useSavingPlans } from "@/hooks/useSaving";
import emptyBox from "@/assets/empty-box.svg";

const SavingsTransaction = () => {
  const { data, isLoading } = useSavingPlans();

  const transactions =
    data?.flatMap((saving) =>
      saving?.transactions?.map((tx) => ({
        id: tx.id,
        goal: tx?.description ?? "No Description",
        amount: tx?.amount ?? 0,
        type: tx?.type ?? "N/A",
        date: tx?.created_at ?? new Date().toISOString(),
        status: tx?.status ?? "N/A",
      })) ?? []
    ) ?? [];

  const formatDate = (isoDate: string) => {
    return new Date(isoDate).toLocaleDateString("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Card className="px-4 pb-2">
      <CardHeader className="flex items-center justify-between px-2">
        <CardTitle className="text-2xl font-semibold">Recent Transactions</CardTitle>
        <div>
          <Link to="/user/transactions" className="uppercase text-megagreen">
            View All
          </Link>
        </div>
      </CardHeader>

      <div className="overflow-x-auto green-scrollbar">
        {isLoading || transactions.length === 0 ? (
          <div className="flex flex-col justify-center items-center py-6">
            <img src={emptyBox} alt="No transactions" />
            <p className="font-medium text-muted-foreground">No Saving plan created yet</p>
          </div>
        ) : (
          <Table>
            <TableBody>
              {transactions.slice(0, 3).map((tx, index) => (
                <TableRow key={index} className="hover:bg-transparent space-y-4 border-t">
                  <TableCell className="flex items-center gap-4">
                    <div className="flex flex-col space-y-2">
                      <p>{tx.goal}</p>
                      <span className="text-xs text-muted-foreground">{formatDate(tx.date)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    ₦{tx.amount}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </Card>
  );
};

export default SavingsTransaction;