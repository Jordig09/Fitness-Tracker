// Los IDs numéricos corresponden a tu tabla 'exercises' en PostgreSQL
export const routineTemplates = {
  // 1 = Cuerpo completo
  1: [
    { title: "Espalda", options: [1, 2, 3] }, // Dominadas, Remo barra, Remo apoyo
    { title: "Pecho", options: [5, 6, 9] }, // Inclinado mancuernas, Banca barra, Militar sentado
    { title: "Piernas", options: [11, 12, 13] },
    { title: "Hombros", options: [14, 15, 17] },
    { title: "Bíceps", options: [18, 19, 20] },
    { title: "Tríceps", options: [21, 22, 23] },
  ],
  // 2 = Día 1 - Pecho, Hombros y Triceps
  2: [
    { title: "Pecho - Ejercicio 1", options: [7, 6] }, // Banca mancuernas o barra
    { title: "Pecho - Ejercicio 2", options: [5, 8] }, // Inclinado o Aperturas
    { title: "Piernas", options: [11] }, // Sillón cuádriceps
    { title: "Hombros - Ejercicio 1", options: [10] }, // Militar mancuernas
    { title: "Hombros - Ejercicio 2", options: [15, 16] }, // Laterales o frontales
    { title: "Tríceps", options: [21, 22, 23] }, // Ext polea, Francés, Empuje
  ],
  // 3 = Día 2 - Espalda, Hombros y Biceps
  3: [
    { title: "Espalda - Ejercicio 1", options: [1, 2] }, // Dominadas o Remo barra
    { title: "Espalda - Ejercicio 2", options: [3, 4] }, // Remo apoyo o 3 apoyos
    { title: "Piernas", options: [12, 13] }, // Isquios o Caídas
    { title: "Hombros", options: [17, 14] }, // Posteriores o Face Pulls
    { title: "Bíceps", options: [18, 19, 20] }, // Alternado, Barra, 21
  ],
};
