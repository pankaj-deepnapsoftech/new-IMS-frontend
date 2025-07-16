import React from 'react';

interface PaginationsProps {
    page: number;
    setPage: (page: number) => void;
    hasNextPage: boolean;
}

const Paginations: React.FC<PaginationsProps> = ({ page, setPage, hasNextPage }) => {
    const handlePrev = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNext = () => {
        if (hasNextPage) setPage(page + 1);
    };

    return (
        <section className="py-4">
            <div className="flex justify-center items-center gap-6 mx-auto max-w-md">
                <button
                    aria-label="Previous page"
                    onClick={handlePrev}
                    disabled={page === 1}
                    className={`px-6 py-2 rounded-3xl text-white transition-colors ${page === 1
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-sky-500 hover:bg-sky-600'
                        }`}
                >
                    Prev
                </button>

                <p className="text-white text-lg font-medium">Page {page}</p>

                <button
                    aria-label="Next page"
                    onClick={handleNext}
                    disabled={!hasNextPage}
                    className={`px-6 py-2 rounded-3xl text-white transition-colors ${!hasNextPage
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-sky-500 hover:bg-sky-600'
                        }`}
                >
                    Next
                </button>
            </div>
        </section>
    );
};

export default Paginations;
