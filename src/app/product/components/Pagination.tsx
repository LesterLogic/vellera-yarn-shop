import { Dispatch, SetStateAction } from 'react';

type PaginationProps = (
    params: {current:number, max:number, action:Dispatch<SetStateAction<number>>}
) => JSX.Element;

const Pagination:PaginationProps = ({current, max, action}) => {
    const updatePage = (page:number):void => {
        action(page);
    }

    const book = new Array(max);
    book.fill(null);

    return (
        <div className="flex flex-row justify-center gap-2 mt-10">
            {book.map((i, index) => {
                const num = index+1;
                return (
                    <span key={`page-${num}`} data-testid="page-selector" className={(current === num ? 'bg-stone-800 text-stone-100' : 'bg-stone-100 text-stone-950') + ' rounded py-2 px-4 cursor-pointer border-2 border-stone-400 hover:bg-stone-800 hover:text-stone-100'} onClick={() => updatePage(num)}>{num}</span>
                );
            })}
        </div>
    );
}

export default Pagination;