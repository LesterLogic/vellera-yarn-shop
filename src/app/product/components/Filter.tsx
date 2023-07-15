import { Dispatch, SetStateAction, useState } from 'react';

type FilterProps = (
    params: {label:string, options:string[], action:Dispatch<SetStateAction<string[]>>}
) => JSX.Element;

const Filter:FilterProps = ({label, options, action}) => {
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

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
            <div className="flex flex-row justify-center flex-wrap gap-x-2 gap-y-2">
                {options.map(option => {
                    return (
                        <div key={`${label}_${option}`} className={(selectedFilters.includes(option) ? "bg-stone-100 text-stone-950" : "bg-stone-600 text-stone-100") + " py-1 px-4 cursor-pointer inline-block hover:bg-stone-300 hover:text-stone-950 rounded"}>
                            <div className="text-center" onClick={() => updateFilter(option)}>{option.charAt(0).toUpperCase() + option.slice(1)}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Filter;