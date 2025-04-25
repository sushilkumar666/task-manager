import { useState } from "react";
import { FileText, Calendar, X } from 'lucide-react';

type Task = {
  title: string;
  description: string;
  dueDate: Date | string;
};

export function TaskCard({ task }: { task: Task }) {
  const [showDetail, setShowDetail] = useState(false);

  const formattedDate = new Date(task.dueDate).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <>
      <div className="p-5 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h2
              className=" font-bold mb-4 text-gray-900 dark:text-white"
              title={task.title} // hover pe pura title dikhega
            >
              {task.title.length > 10 ? `${task.title.slice(0, 10)}...` : task.title}
            </h2>
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <Calendar size={14} className="mr-1" />
              <span className="text-sm">{formattedDate}</span>
            </div>
          </div>
          <button
            onClick={() => setShowDetail(true)}
            className="p-2 rounded-full bg-blue-50 text-blue-600 dark:bg-gray-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-gray-600 transition-colors duration-200"
            aria-label="View task details"
          >
            <FileText size={18} />
          </button>
        </div>
      </div>

      {showDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4">
          <div className="relative bg-white dark:bg-gray-800 rounded-xl w-full max-w-lg max-h-[90vh] shadow-2xl overflow-hidden">

            {/* Header bar */}
            <div className="bg-blue-500 dark:bg-blue-600 h-2 w-full" />

            {/* Close button */}
            <button
              onClick={() => setShowDetail(false)}
              className="absolute top-4 right-4 p-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
              aria-label="Close modal"
            >
              <X size={16} />
            </button>

            {/* Scrollable content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-3rem)] custom-scrollbar">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{task.title}</h2>

              {task.description && (
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4">
                  <p className="text-gray-700 dark:text-gray-300 text-justify whitespace-pre-line leading-relaxed">
                    {task.description}
                  </p>
                </div>
              )}

              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Calendar size={14} className="mr-2" />
                <span>Due: {formattedDate}</span>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowDetail(false)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </>
  );
}
