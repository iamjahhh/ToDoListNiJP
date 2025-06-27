'use client';

import React, { useEffect } from 'react';
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const playSound = (sound) => {
    const audio = new Audio(`/${sound}.mp3`);
    audio.play();
  };

  const [inputText, setInputText] = useState("");
  const [tasks, setTasks] = useState([]);

  const [isEditing, setIsEditing] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);

  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  const addNewTask = () => {
    if (isEditing && editTaskId) {
      setTasks(prev => {
        const updated = prev.map(task => {
          if (task.id === editTaskId) {
            return { ...task, text: inputText };
          }
          return task;
        });
        localStorage.setItem("tasks", JSON.stringify(updated));
        return updated;
      });

      setInputText("");
      setIsEditing(false);
      setEditTaskId(null);
      playSound('edit');
      return;
    }

    if (inputText.trim() === "") {
      return;
    }

    const newTask = {
      id: Date.now(),
      text: inputText,
      completed: false,
    };

    setTasks(prev => {
      const updated = [...prev, newTask];
      localStorage.setItem("tasks", JSON.stringify(updated));
      return updated;
    });

    setInputText("");
    playSound('add');
  }

  return (
    <div className="flex flex-col justify-center items-center align-items-center h-screen ">
      <div className="flex flex-col w-[90%] md:w-[45%] border-3 border-gray-500 items-center rounded-3xl flex backdrop-blur-md bg-white/3 p-6">
        <h1 className="font-pixelify text-4xl mt-2 mb-9">To-Do List</h1>

        <div className="flex flex-row w-full">
          <input className="border-2 bg-white/20 border-gray-600 rounded-3xl px-4 p-2 w-full mr-2" placeholder="Add a new task..." value={inputText} onChange={(e) => setInputText(e.target.value)} />

          <button className="bg-white/20 border-2 border-gray-600 hover:bg-white/50 rounded-3xl px-2" onClick={addNewTask}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </div>

        {!isEditing && tasks.length > 0 ? (
          <ul className="w-full mt-8">
            {tasks.map((task) => (
              <li key={task.id} className="flex items-center border-gray-500 rounded-3xl py-2 px-3 backdrop-blur-md bg-white/30 mb-2">

                <div className="flex justify-between items-center w-full">
                  <div className="flex">
                    <label className="relative inline-flex items-center cursor-pointer mr-3">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={task.completed}
                        onChange={() => {
                          setTasks(prev => {
                            const updated = prev.map(t => {
                              if (t.id === task.id) {
                                return { ...t, completed: !t.completed };
                              }
                              return t;
                            });

                            const currentTaskCompleted = !task.completed;
                            const allCompleted = updated.every(t => t.completed);

                            if (allCompleted) {
                              playSound('all-complete');
                            } else {
                              playSound(currentTaskCompleted ? 'complete' : 'uncheck');
                            }

                            localStorage.setItem("tasks", JSON.stringify(updated));
                            return updated;
                          });
                        }}
                      />
                      <div className="w-5 h-5 rounded-full border-2 border-white/30 peer-checked:bg-green-400/30 transition-colors"></div>
                    </label>

                    <span
                      className={`font-pixelify text-lg truncate max-w-full ${task.completed ? 'line-through text-gray-800' : ''}`}
                    >
                      {task.text.length > 18 ? task.text.slice(0, 18) + '...' : task.text}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      className="bg-violet-800 hover:bg-violet-900 rounded-3xl px-1 py-1"
                      onClick={() => {
                        if (isEditing && editTaskId === task.id) {
                          setIsEditing(false);
                          setEditTaskId(null);
                        } else {
                          setInputText(task.text);
                          setIsEditing(true);
                          setEditTaskId(task.id);
                        }
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                      </svg>
                    </button>

                    <button
                      className="bg-green-800 hover:bg-green-900 rounded-3xl px-1 py-1"
                      onClick={() => {
                        setTasks(prev => {
                          const updated = prev.filter(t => t.id !== task.id);
                          localStorage.setItem("tasks", JSON.stringify(updated));
                          playSound('delete');
                          return updated;
                        });
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </div>

              </li>
            ))}
          </ul>
        ) : (
          <Image src="/penguin.webp" alt="Penguin" width={200} height={200} className="mt-6 mb-4" />
        )}

      </div>

    </div>
  );
}
