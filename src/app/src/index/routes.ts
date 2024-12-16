import { Router } from "express";

type TModuleRoutes = {
  path: string;
  route: Router;
};

const router = Router();

const moduleRoutes: TModuleRoutes[] = [];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
