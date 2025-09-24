import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis,
} from "../ui/pagination";

type PaginationProps ={
    currentPage: number;
    totalPages: number;
    setCurrentPage: (page: number) => void;
}

const TransactionPagination = ({currentPage, totalPages, setCurrentPage} : PaginationProps) => {
    return (
          
            
            <Pagination className="justify-end text-megagreen">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)} />
                    </PaginationItem>

                    {Array.from({length:totalPages}, (_, i) => (
                        <PaginationItem key={i}>
                            <PaginationLink 
                               
                                isActive={i + 1 === currentPage}
                                onClick={()=> setCurrentPage(i + 1)}

                            >{i + 1}</PaginationLink>
                        </PaginationItem>
                    ))}

                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext  onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)} />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
    );
};

export default TransactionPagination;