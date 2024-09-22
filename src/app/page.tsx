"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import styles from "./home.module.scss";
import Navbar from "@/components/Navbar";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { FiTrash, FiCheck } from "react-icons/fi";
import Title from "@/components/Title";

const schema = yup.object().shape({
  taskName: yup.string().required("O nome da tarefa é obrigatório"),
});

interface Task {
  id: number;
  name: string;
  completed: boolean;
}

interface FormData {
  taskName: string;
}

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [nextId, setNextId] = useState(1);
  const [taskToDelete, setTaskToDelete] = useState<number | undefined>();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      taskName: "",
    },
  });

  const saveTasksToLocalStorage = (tasks: Task[]) => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };

  const loadTasksFromLocalStorage = () => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      return JSON.parse(storedTasks);
    }
    return [];
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    reset();
  };

  const onSubmit = (data: FormData) => {
    const newTask: Task = {
      id: nextId,
      name: data.taskName,
      completed: false,
    };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
    setNextId(nextId + 1);
    reset();
    closeModal();
  };

  const handleCheckboxChange = (taskId: number) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
  };

  const handleDeleteTask = (taskId: number) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
    setIsModalDeleteOpen(false);
  };

  const activeTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  useEffect(() => {
    const savedTasks = loadTasksFromLocalStorage();
    setTasks(savedTasks);
    setNextId(
      savedTasks.length > 0 ? savedTasks[savedTasks.length - 1].id + 1 : 1
    );
  }, []);

  return (
    <div>
      <Navbar />
      <main className={styles.container}>
        <div style={{ width: "450px" }}>
          <div className={styles.card}>
            <span className={styles["title-card"]}>Suas tarefas de hoje</span>
            <div className={styles["tasks-list"]}>
              {activeTasks.map((task) => (
                <div key={task.id} className={styles["task-card"]}>
                  <div className={styles.checkbox}>
                    <input
                      id={`task-${task.id}`}
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleCheckboxChange(task.id)}
                    />
                    <label
                      htmlFor={`task-${task.id}`}
                      className={task.completed ? styles["task-completed"] : ""}
                    >
                      {task.name}
                    </label>
                  </div>

                  <button
                    onClick={() => {
                      setIsModalDeleteOpen(true);
                      setTaskToDelete(task.id);
                    }}
                    className={styles["button-delete"]}
                  >
                    <FiTrash className={styles["icon-trash"]} />
                  </button>
                </div>
              ))}
            </div>
            <span className={styles["title-card"]}>Tarefas finalizadas</span>
            <div className={styles["tasks-list"]}>
              {completedTasks.map((task) => (
                <div key={task.id} className={styles["task-card"]}>
                  <div className={styles.checkbox}>
                    <input
                      id={`task-${task.id}`}
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleCheckboxChange(task.id)}
                    />
                    {task.completed && (
                      <FiCheck className={styles["check-icon"]} />
                    )}
                    <label
                      htmlFor={`task-${task.id}`}
                      className={task.completed ? styles["task-completed"] : ""}
                    >
                      {task.name}
                    </label>
                  </div>

                  <button
                    className={styles["button-delete"]}
                    onClick={() => {
                      setTaskToDelete(task.id);
                      setIsModalDeleteOpen(true);
                    }}
                  >
                    <FiTrash className={styles["icon-trash"]} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <Button text="Adicionar nova tarefa" onClick={openModal} />
          <Modal isOpen={isModalOpen} onClose={closeModal}>
            <div className={styles["modal-body"]}>
              <Title text="Adicionar Nova Tarefa" />
              <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                <div className={styles["form-group"]}>
                  <label htmlFor="taskName">Título</label>
                  <Controller
                    name="taskName"
                    control={control}
                    render={({ field }) => (
                      <input
                        id="taskName"
                        type="text"
                        placeholder="Digite"
                        {...field}
                        className={`${styles.formInput} ${
                          errors.taskName ? styles.error : ""
                        }`}
                      />
                    )}
                  />
                  {errors.taskName && (
                    <p className={styles.errorMessage}>
                      {errors.taskName.message}
                    </p>
                  )}
                </div>
                <div className={styles["container-buttons"]}>
                  <Button text="Cancelar" color="cancel" onClick={closeModal} />
                  <Button text="Adicionar" type="submit" />
                </div>
              </form>
            </div>
          </Modal>
          {isModalDeleteOpen && (
            <Modal
              isOpen={isModalDeleteOpen}
              onClose={() => setIsModalDeleteOpen(false)}
            >
              <div className={styles["modal-body"]}>
                <Title text="Deletar tarefa" />
                <p>Tem certeza que você deseja deletar essa tarefa?</p>
                <div className={styles["container-buttons"]}>
                  <Button
                    text="Cancelar"
                    color="cancel"
                    onClick={() => setIsModalDeleteOpen(false)}
                  />
                  <Button
                    text="Deletar"
                    color="danger"
                    onClick={() => {
                      if (taskToDelete !== undefined) {
                        handleDeleteTask(taskToDelete);
                      }
                    }}
                  />
                </div>
              </div>
            </Modal>
          )}
        </div>
      </main>
    </div>
  );
}
