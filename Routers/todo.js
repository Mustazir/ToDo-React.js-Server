import express from 'express';
import { getallToDo,getTodo,updateToDo,deleteTodo,addToDO } from '../Controller/todo.js';

const router = express.Router();

router.get('/', getallToDo);

router.post('/', addToDO);

router.put('/:id', updateToDo);

router.get('/:id', getTodo);
router.delete('/:id',deleteTodo);

export default router;
