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
    // Don't show pagination if only 1 page or no pages
    if (totalPages <= 1) return null;
    
    return (
        <Pagination className="justify-center sm:justify-end text-megagreen">
            <PaginationContent className="flex-wrap">
                <PaginationItem>
                    <PaginationPrevious 
                        onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                        className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                    />
                </PaginationItem>

                {totalPages <= 5 ? (
                    // Show all pages if 5 or fewer
                    Array.from({length: totalPages}, (_, i) => (
                        <PaginationItem key={i}>
                            <PaginationLink 
                                isActive={i + 1 === currentPage}
                                onClick={() => setCurrentPage(i + 1)}
                            >
                                {i + 1}
                            </PaginationLink>
                        </PaginationItem>
                    ))
                ) : (
                    // Show smart pagination for more than 5 pages
                    <>
                        <PaginationItem>
                            <PaginationLink 
                                isActive={currentPage === 1}
                                onClick={() => setCurrentPage(1)}
                            >
                                1
                            </PaginationLink>
                        </PaginationItem>
                        {currentPage > 3 && (
                            <PaginationItem>
                                <PaginationEllipsis />
                            </PaginationItem>
                        )}
                        {currentPage > 2 && (
                            <PaginationItem>
                                <PaginationLink onClick={() => setCurrentPage(currentPage - 1)}>
                                    {currentPage - 1}
                                </PaginationLink>
                            </PaginationItem>
                        )}
                        {currentPage > 1 && currentPage < totalPages && (
                            <PaginationItem>
                                <PaginationLink isActive>
                                    {currentPage}
                                </PaginationLink>
                            </PaginationItem>
                        )}
                        {currentPage < totalPages - 1 && (
                            <PaginationItem>
                                <PaginationLink onClick={() => setCurrentPage(currentPage + 1)}>
                                    {currentPage + 1}
                                </PaginationLink>
                            </PaginationItem>
                        )}
                        {currentPage < totalPages - 2 && (
                            <PaginationItem>
                                <PaginationEllipsis />
                            </PaginationItem>
                        )}
                        <PaginationItem>
                            <PaginationLink 
                                isActive={currentPage === totalPages}
                                onClick={() => setCurrentPage(totalPages)}
                            >
                                {totalPages}
                            </PaginationLink>
                        </PaginationItem>
                    </>
                )}

                <PaginationItem>
                    <PaginationNext  
                        onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                        className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
};

export default TransactionPagination;