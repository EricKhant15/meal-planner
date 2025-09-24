import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import CustomButton from './CustomButton';

export default function DeleteConfirmDialog({ isOpen, onClose, onConfirm, itemName }) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-slate-900/95 backdrop-blur-md border border-slate-700/50 p-6 text-left align-middle shadow-2xl transition-all">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex-shrink-0 w-12 h-12 mx-auto bg-red-500/20 rounded-full flex items-center justify-center">
                    <ExclamationTriangleIcon className="w-6 h-6 text-red-400" />
                  </div>
                  <div className="text-center flex-1">
                    <Dialog.Title as="h3" className="text-xl font-semibold text-white">
                      Delete Confirmation
                    </Dialog.Title>
                  </div>
                </div>

                <div className="text-center mb-8">
                  <p className="text-slate-300 text-lg mb-2">
                    Are you sure you want to delete
                  </p>
                  <p className="text-white font-semibold text-xl">
                    "{itemName}"?
                  </p>
                  <p className="text-slate-400 text-sm mt-2">
                    This action cannot be undone.
                  </p>
                </div>

                <div className="flex justify-center space-x-4">
                  <CustomButton
                    type="button"
                    variant="secondary"
                    onClick={onClose}
                  >
                    Cancel
                  </CustomButton>
                  <CustomButton
                    type="button"
                    variant="danger"
                    onClick={onConfirm}
                  >
                    Delete
                  </CustomButton>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
