import { Dispatch, SetStateAction, useState } from 'react';

type FilterProps = (
    params: {label:string, options:string[], action:Dispatch<SetStateAction<string[]>>, defaultValue?:string[]}
) => JSX.Element;

const Filter:FilterProps = ({label, options, action, defaultValue=[]}) => {

    const [selectedFilters, setSelectedFilters] = useState<string[]>(defaultValue);

    const updateFilter = (option:string):void => {
        let myOptions = [...selectedFilters];
        if (myOptions.includes(option)) {
            myOptions.splice(myOptions.indexOf(option), 1);
        } else {
            myOptions.push(option);
        }

        setSelectedFilters(myOptions)
        action(myOptions);
    }

    return (
        <div>
            <div className="text-lg font-bold text-stone-50 text-center mb-2">{label}</div>
            <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 grid-rows-auto gap-x-2 gap-y-2">
                {options.map(option => {
                    return (
                        <div key={`${label}_${option}`}  data-testid="filter" title={`${option} filter`} onClick={() => updateFilter(option)} className={(selectedFilters.includes(option) ? 'bg-stone-800 text-stone-100' : 'bg-stone-100 text-stone-950') + " px-4 cursor-pointer inline-block rounded border-2 border-stone-400 hover:bg-stone-800 hover:text-stone-100"}>
                            <div className="text-center">{option.charAt(0).toUpperCase() + option.slice(1)}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Filter;