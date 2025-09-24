import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

export default function CustomSelect({ options, value, onChange, placeholder = "Select an option" }) {
  const selectedOption = options.find(option => option.value === value);

  return (
    <Listbox value={value} onChange={onChange}>
      <div className="relative">
        <Listbox.Button className="w-full px-6 py-4 bg-white/70 border border-slate-200/50 rounded-2xl shadow-lg focus:ring-4 focus:ring-amber-300/50 text-slate-800 transition-all duration-300 backdrop-blur-md text-left hover:bg-white/80 hover:border-slate-300/60">
          <span className="block truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-6">
            <ChevronUpDownIcon className="h-5 w-5 text-slate-500" aria-hidden="true" />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/50 py-2 text-base shadow-2xl focus:outline-none sm:text-sm">
            {options.map((option, optionIdx) => (
              <Listbox.Option
                key={optionIdx}
                className={({ active }) =>
                  `relative cursor-default select-none py-3 px-6 rounded-lg mx-2 ${
                    active ? 'bg-amber-100 text-slate-800' : 'text-slate-700 hover:bg-slate-100'
                  }`
                }
                value={option.value}
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? 'font-medium' : 'font-normal'
                      }`}
                    >
                      {option.label}
                    </span>
                    {selected ? (
                      <span className="absolute inset-y-0 right-0 flex items-center pr-6">
                        <CheckIcon className="h-5 w-5 text-slate-500" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}
