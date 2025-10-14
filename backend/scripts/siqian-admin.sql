/*
 Navicat Premium Data Transfer

 Source Server         : 81.70.179.86_15432
 Source Server Type    : PostgreSQL
 Source Server Version : 110012 (110012)
 Source Host           : 81.70.179.86:15432
 Source Catalog        : go_admin
 Source Schema         : public

 Target Server Type    : PostgreSQL
 Target Server Version : 110012 (110012)
 File Encoding         : 65001

 Date: 14/10/2025 09:08:39
*/


-- ----------------------------
-- Sequence structure for dict_items_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."dict_items_id_seq";
CREATE SEQUENCE "public"."dict_items_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for dicts_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."dicts_id_seq";
CREATE SEQUENCE "public"."dicts_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for menus_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."menus_id_seq";
CREATE SEQUENCE "public"."menus_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for organizations_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."organizations_id_seq";
CREATE SEQUENCE "public"."organizations_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for roles_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."roles_id_seq";
CREATE SEQUENCE "public"."roles_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for sys_access_logs_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."sys_access_logs_id_seq";
CREATE SEQUENCE "public"."sys_access_logs_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for users_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."users_id_seq";
CREATE SEQUENCE "public"."users_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Table structure for sys_access_logs
-- ----------------------------
DROP TABLE IF EXISTS "public"."sys_access_logs";
CREATE TABLE "public"."sys_access_logs" (
  "id" int8 NOT NULL DEFAULT nextval('sys_access_logs_id_seq'::regclass),
  "username" varchar(128) COLLATE "pg_catalog"."default",
  "path" varchar(512) COLLATE "pg_catalog"."default",
  "method" varchar(16) COLLATE "pg_catalog"."default",
  "ip" varchar(64) COLLATE "pg_catalog"."default",
  "status_code" int8,
  "user_agent" varchar(512) COLLATE "pg_catalog"."default",
  "latency_ms" int8,
  "created_at" timestamptz(6)
)
;

-- ----------------------------
-- Records of sys_access_logs
-- ----------------------------
INSERT INTO "public"."sys_access_logs" VALUES (43, 'cheng', '/api/v1/auth/logout', 'POST', '::1', 200, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 20, '2025-10-14 00:00:33.940243+00');
INSERT INTO "public"."sys_access_logs" VALUES (44, '', '/api/v1/auth/login', 'POST', '::1', 200, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 395, '2025-10-14 00:00:40.365671+00');
INSERT INTO "public"."sys_access_logs" VALUES (45, 'cheng', '/api/v1/menus', 'POST', '::1', 201, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 156, '2025-10-14 00:02:35.628344+00');
INSERT INTO "public"."sys_access_logs" VALUES (46, 'cheng', '/api/v1/auth/logout', 'POST', '::1', 200, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 20, '2025-10-14 00:02:37.540742+00');
INSERT INTO "public"."sys_access_logs" VALUES (48, 'cheng', '/api/v1/logs/batch', 'DELETE', '::1', 403, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 45, '2025-10-14 00:09:33.19842+00');
INSERT INTO "public"."sys_access_logs" VALUES (49, 'cheng', '/api/v1/auth/logout', 'POST', '::1', 200, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 22, '2025-10-14 00:10:21.085003+00');
INSERT INTO "public"."sys_access_logs" VALUES (51, 'cheng', '/api/v1/logs/batch', 'DELETE', '::1', 403, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 46, '2025-10-14 00:10:33.851175+00');
INSERT INTO "public"."sys_access_logs" VALUES (52, 'cheng', '/api/v1/auth/logout', 'POST', '::1', 200, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 22, '2025-10-14 00:11:26.259588+00');
INSERT INTO "public"."sys_access_logs" VALUES (54, 'cheng', '/api/v1/auth/logout', 'POST', '::1', 200, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 22, '2025-10-14 00:21:15.492543+00');
INSERT INTO "public"."sys_access_logs" VALUES (56, 'cheng', '/api/v1/logs/batch', 'DELETE', '::1', 200, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 135, '2025-10-14 00:21:30.187639+00');
INSERT INTO "public"."sys_access_logs" VALUES (57, 'cheng', '/api/v1/auth/logout', 'POST', '::1', 200, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 23, '2025-10-14 00:26:50.085669+00');
INSERT INTO "public"."sys_access_logs" VALUES (58, '', '/api/v1/auth/login', 'POST', '::1', 200, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 250, '2025-10-14 00:26:56.803216+00');
INSERT INTO "public"."sys_access_logs" VALUES (59, 'cheng', '/api/v1/menus/764750581662224384', 'PUT', '::1', 200, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 317, '2025-10-14 00:30:22.279737+00');
INSERT INTO "public"."sys_access_logs" VALUES (60, 'cheng', '/api/v1/auth/logout', 'POST', '::1', 200, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 22, '2025-10-14 00:30:25.706027+00');
INSERT INTO "public"."sys_access_logs" VALUES (61, '', '/api/v1/auth/login', 'POST', '::1', 200, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 265, '2025-10-14 00:30:30.862095+00');
INSERT INTO "public"."sys_access_logs" VALUES (62, 'cheng', '/api/v1/auth/logout', 'POST', '::1', 200, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 19, '2025-10-14 00:52:40.468515+00');
INSERT INTO "public"."sys_access_logs" VALUES (63, '', '/api/v1/auth/login', 'POST', '::1', 200, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 257, '2025-10-14 00:53:12.835566+00');
INSERT INTO "public"."sys_access_logs" VALUES (64, 'admin', '/api/v1/profile/upload-avatar', 'POST', '::1', 200, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 436, '2025-10-14 00:53:19.844139+00');
INSERT INTO "public"."sys_access_logs" VALUES (65, 'admin', '/api/v1/auth/logout', 'POST', '::1', 200, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 21, '2025-10-14 00:55:48.041189+00');
INSERT INTO "public"."sys_access_logs" VALUES (66, '', '/api/v1/auth/login', 'POST', '::1', 200, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 265, '2025-10-14 00:55:55.606271+00');
INSERT INTO "public"."sys_access_logs" VALUES (67, 'admin', '/api/v1/auth/logout', 'POST', '::1', 200, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 107, '2025-10-14 01:03:48.130558+00');
INSERT INTO "public"."sys_access_logs" VALUES (68, '', '/api/v1/auth/login', 'POST', '::1', 200, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 402, '2025-10-14 01:03:54.231461+00');
INSERT INTO "public"."sys_access_logs" VALUES (69, 'admin', '/api/v1/profile/change-password', 'POST', '::1', 200, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 586, '2025-10-14 01:04:04.555829+00');
INSERT INTO "public"."sys_access_logs" VALUES (70, 'admin', '/api/v1/auth/logout', 'POST', '::1', 200, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 27, '2025-10-14 01:04:06.319674+00');
INSERT INTO "public"."sys_access_logs" VALUES (71, '', '/api/v1/auth/login', 'POST', '::1', 200, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 237, '2025-10-14 01:04:11.509921+00');

-- ----------------------------
-- Table structure for sys_dict_items
-- ----------------------------
DROP TABLE IF EXISTS "public"."sys_dict_items";
CREATE TABLE "public"."sys_dict_items" (
  "id" int8 NOT NULL DEFAULT nextval('dict_items_id_seq'::regclass),
  "dict_id" int8 NOT NULL,
  "label" text COLLATE "pg_catalog"."default" NOT NULL,
  "value" text COLLATE "pg_catalog"."default" NOT NULL,
  "sort" int8 DEFAULT 0,
  "status" int8 DEFAULT 1,
  "created_at" timestamptz(6),
  "updated_at" timestamptz(6),
  "deleted_at" timestamptz(6)
)
;

-- ----------------------------
-- Records of sys_dict_items
-- ----------------------------
INSERT INTO "public"."sys_dict_items" VALUES (2, 2, '女', '21', 0, 1, '2025-10-10 09:45:53.345517+00', '2025-10-11 00:03:47.436353+00', NULL);
INSERT INTO "public"."sys_dict_items" VALUES (1, 2, '男', '1', 1, 1, '2025-10-10 09:27:22.994321+00', '2025-10-11 00:03:53.190436+00', NULL);
INSERT INTO "public"."sys_dict_items" VALUES (3, 3, '正常', '1', 0, 1, '2025-10-11 00:04:49.102763+00', '2025-10-11 00:04:49.102763+00', NULL);
INSERT INTO "public"."sys_dict_items" VALUES (4, 3, '禁用', '0', 1, 1, '2025-10-11 00:04:58.736415+00', '2025-10-11 00:05:03.210369+00', NULL);

-- ----------------------------
-- Table structure for sys_dicts
-- ----------------------------
DROP TABLE IF EXISTS "public"."sys_dicts";
CREATE TABLE "public"."sys_dicts" (
  "id" int8 NOT NULL DEFAULT nextval('dicts_id_seq'::regclass),
  "name" text COLLATE "pg_catalog"."default" NOT NULL,
  "code" text COLLATE "pg_catalog"."default" NOT NULL,
  "description" text COLLATE "pg_catalog"."default",
  "status" int8 DEFAULT 1,
  "created_at" timestamptz(6),
  "updated_at" timestamptz(6),
  "deleted_at" timestamptz(6)
)
;

-- ----------------------------
-- Records of sys_dicts
-- ----------------------------
INSERT INTO "public"."sys_dicts" VALUES (1, '系统管理', 'SYS', '', 1, '2025-10-10 08:56:28.790667+00', '2025-10-10 08:56:28.790667+00', '2025-10-10 08:56:35.188058+00');
INSERT INTO "public"."sys_dicts" VALUES (2, '性别', 'sex1', '', 1, '2025-10-10 09:18:59.724431+00', '2025-10-11 00:03:11.904597+00', NULL);
INSERT INTO "public"."sys_dicts" VALUES (3, '状态', 'status', '', 1, '2025-10-11 00:04:36.85827+00', '2025-10-11 00:04:36.85827+00', NULL);

-- ----------------------------
-- Table structure for sys_menus
-- ----------------------------
DROP TABLE IF EXISTS "public"."sys_menus";
CREATE TABLE "public"."sys_menus" (
  "id" int8 NOT NULL DEFAULT nextval('menus_id_seq'::regclass),
  "name" text COLLATE "pg_catalog"."default" NOT NULL,
  "parent_id" int8,
  "path" text COLLATE "pg_catalog"."default",
  "component" text COLLATE "pg_catalog"."default",
  "icon" text COLLATE "pg_catalog"."default",
  "type" int8 DEFAULT 1,
  "sort" int8 DEFAULT 0,
  "status" text COLLATE "pg_catalog"."default" DEFAULT 1,
  "created_at" timestamptz(6),
  "updated_at" timestamptz(6),
  "deleted_at" timestamptz(6),
  "permission" text COLLATE "pg_catalog"."default",
  "route" text COLLATE "pg_catalog"."default",
  "hidden" bool,
  "keep_alive" bool
)
;
COMMENT ON COLUMN "public"."sys_menus"."permission" IS '权限标识';
COMMENT ON COLUMN "public"."sys_menus"."route" IS '前端路由路径';
COMMENT ON COLUMN "public"."sys_menus"."hidden" IS '是否在菜单中隐藏';
COMMENT ON COLUMN "public"."sys_menus"."keep_alive" IS '是否缓存页面';

-- ----------------------------
-- Records of sys_menus
-- ----------------------------
INSERT INTO "public"."sys_menus" VALUES (764678522428985344, '仪表盘', NULL, '764678522428985344', 'Dashboard', 'dashboard', 1, 0, '1', '2025-10-11 02:39:26.810747+00', '2025-10-11 07:22:36.335513+00', NULL, '', '/dashboard', 'f', 'f');
INSERT INTO "public"."sys_menus" VALUES (764413470270558208, '用户管理', 764411186404921344, '764411186404921344/764413470270558208', 'user/UserManagement', 'user', 1, 1, '1', '2025-10-10 09:06:13.49964+00', '2025-10-11 07:14:40.071608+00', NULL, '', '/users', 'f', 'f');
INSERT INTO "public"."sys_menus" VALUES (764416622046744576, '组织管理', 764411186404921344, '764411186404921344/764416622046744576', 'organization/OrganizationManagement', 'team', 1, 2, '1', '2025-10-10 09:18:44.938131+00', '2025-10-11 07:22:01.843192+00', NULL, '', '/organizations', 'f', 'f');
INSERT INTO "public"."sys_menus" VALUES (764678660555804672, '角色管理', 764411186404921344, '764411186404921344/764678660555804672', 'role/RoleManagement', 'safety', 1, 3, '1', '2025-10-11 02:39:59.769346+00', '2025-10-11 07:22:08.558142+00', NULL, '', '/roles', 'f', 'f');
INSERT INTO "public"."sys_menus" VALUES (764678715316637696, '菜单管理', 764411186404921344, '764411186404921344/764678715316637696', 'menu/MenuManagement', 'menu', 1, 4, '1', '2025-10-11 02:40:12.824049+00', '2025-10-11 07:22:16.778338+00', NULL, '', '/menus', 'f', 'f');
INSERT INTO "public"."sys_menus" VALUES (764678783432134656, '字典管理', 764411186404921344, '764411186404921344/764678783432134656', 'dict/DictList', 'book', 1, 5, '1', '2025-10-11 02:40:29.083684+00', '2025-10-11 07:22:29.372965+00', NULL, '', '/dict', 'f', 'f');
INSERT INTO "public"."sys_menus" VALUES (765500350445654016, '列表', 764413470270558208, '764411186404921344/764413470270558208/765500350445654016', '', '', 2, 0, '1', '2025-10-13 09:05:05.922948+00', '2025-10-13 09:17:05.705475+00', NULL, 'user:list', '', 'f', 'f');
INSERT INTO "public"."sys_menus" VALUES (765515614461628416, '操作日志', 764411186404921344, '764411186404921344/765515614461628416', 'logs/AccessLogList.tsx', 'date-range', 1, 6, '1', '2025-10-13 10:05:45.146212+00', '2025-10-13 10:06:54.832431+00', NULL, '', '/logs', 'f', 'f');
INSERT INTO "public"."sys_menus" VALUES (765726212189327360, '删除', 765515614461628416, '764411186404921344/765515614461628416/765726212189327360', '', '', 2, 0, '1', '2025-10-14 00:02:35.559408+00', '2025-10-14 00:02:35.559408+00', NULL, 'log:delete', '', 'f', 'f');
INSERT INTO "public"."sys_menus" VALUES (764750581662224384, '删除', 764413470270558208, '764411186404921344/764413470270558208/764750581662224384', '', '', 2, 0, '1', '2025-10-11 07:25:47.094941+00', '2025-10-14 00:30:22.211917+00', NULL, 'user:delete', '', 'f', 'f');
INSERT INTO "public"."sys_menus" VALUES (764411186404921344, '系统管理', NULL, '764411186404921344', '', 'appstore', 1, 1, '1', '2025-10-10 08:57:08.936428+00', '2025-10-11 07:22:58.512165+00', NULL, '', '', 'f', 'f');
INSERT INTO "public"."sys_menus" VALUES (764750499638415360, '新增', 764413470270558208, '764411186404921344/764413470270558208/764750499638415360', '', '', 2, 0, '1', '2025-10-11 07:25:27.541431+00', '2025-10-11 07:25:27.541431+00', NULL, 'user:create', '', 'f', 'f');

-- ----------------------------
-- Table structure for sys_organizations
-- ----------------------------
DROP TABLE IF EXISTS "public"."sys_organizations";
CREATE TABLE "public"."sys_organizations" (
  "id" int8 NOT NULL DEFAULT nextval('organizations_id_seq'::regclass),
  "name" text COLLATE "pg_catalog"."default" NOT NULL,
  "code" text COLLATE "pg_catalog"."default" NOT NULL,
  "parent_id" int8,
  "sort" int8 DEFAULT 0,
  "status" text COLLATE "pg_catalog"."default" DEFAULT 1,
  "description" text COLLATE "pg_catalog"."default",
  "created_at" timestamptz(6),
  "updated_at" timestamptz(6),
  "deleted_at" timestamptz(6),
  "path" text COLLATE "pg_catalog"."default",
  "created_by" int8,
  "updated_by" int8,
  "deleted_by" int8
)
;

-- ----------------------------
-- Records of sys_organizations
-- ----------------------------
INSERT INTO "public"."sys_organizations" VALUES (764367417135599616, 'XX信息技术有限公司', '1', NULL, 0, '1', '', '2025-10-10 06:03:13.52824+00', '2025-10-10 06:03:13.52824+00', NULL, '764367417135599616', NULL, NULL, NULL);
INSERT INTO "public"."sys_organizations" VALUES (764387680707416064, '研发部', 'yf', 764367417135599616, 0, '1', '', '2025-10-10 07:23:44.813826+00', '2025-10-10 07:23:44.813826+00', NULL, '764367417135599616/764387680707416064', NULL, NULL, NULL);
INSERT INTO "public"."sys_organizations" VALUES (764387777109299200, '研发岗', 'yfg', 764387680707416064, 0, '1', '', '2025-10-10 07:24:07.820674+00', '2025-10-10 07:24:07.820674+00', NULL, '764367417135599616/764387680707416064/764387777109299200', NULL, NULL, NULL);
INSERT INTO "public"."sys_organizations" VALUES (764402217745649664, '质量部', 'zl', 764367417135599616, 3, '1', '', '2025-10-10 08:21:30.76229+00', '2025-10-10 08:21:59.718965+00', '2025-10-10 08:21:59.898721+00', '764367417135599616/764402217745649664', 1, 1, 1);
INSERT INTO "public"."sys_organizations" VALUES (764387730745462784, '测试部', 'cs', 764367417135599616, 0, '1', '', '2025-10-10 07:23:56.741151+00', '2025-10-11 00:28:34.965194+00', NULL, '764367417135599616/764387730745462784', 0, 1, NULL);
INSERT INTO "public"."sys_organizations" VALUES (764669202601611264, '质量部', 'zhiliang', 764367417135599616, 0, '1', '', '2025-10-11 02:02:24.89569+00', '2025-10-13 09:44:27.580091+00', NULL, '764367417135599616/764669202601611264', 1, 1, NULL);

-- ----------------------------
-- Table structure for sys_role_menus
-- ----------------------------
DROP TABLE IF EXISTS "public"."sys_role_menus";
CREATE TABLE "public"."sys_role_menus" (
  "role_id" int8 NOT NULL,
  "menu_id" int8 NOT NULL
)
;

-- ----------------------------
-- Records of sys_role_menus
-- ----------------------------
INSERT INTO "public"."sys_role_menus" VALUES (1, 764678522428985344);
INSERT INTO "public"."sys_role_menus" VALUES (1, 764413470270558208);
INSERT INTO "public"."sys_role_menus" VALUES (1, 764416622046744576);
INSERT INTO "public"."sys_role_menus" VALUES (1, 764678660555804672);
INSERT INTO "public"."sys_role_menus" VALUES (1, 764678715316637696);
INSERT INTO "public"."sys_role_menus" VALUES (1, 764678783432134656);
INSERT INTO "public"."sys_role_menus" VALUES (1, 765500350445654016);
INSERT INTO "public"."sys_role_menus" VALUES (1, 765515614461628416);
INSERT INTO "public"."sys_role_menus" VALUES (1, 764411186404921344);
INSERT INTO "public"."sys_role_menus" VALUES (1, 764750499638415360);
INSERT INTO "public"."sys_role_menus" VALUES (1, 764750581662224384);
INSERT INTO "public"."sys_role_menus" VALUES (1, 765726212189327360);

-- ----------------------------
-- Table structure for sys_roles
-- ----------------------------
DROP TABLE IF EXISTS "public"."sys_roles";
CREATE TABLE "public"."sys_roles" (
  "id" int8 NOT NULL DEFAULT nextval('roles_id_seq'::regclass),
  "name" text COLLATE "pg_catalog"."default" NOT NULL,
  "code" text COLLATE "pg_catalog"."default" NOT NULL,
  "description" text COLLATE "pg_catalog"."default",
  "status" text COLLATE "pg_catalog"."default" DEFAULT 1,
  "sort" int8 DEFAULT 0,
  "created_at" timestamptz(6),
  "updated_at" timestamptz(6),
  "deleted_at" timestamptz(6)
)
;

-- ----------------------------
-- Records of sys_roles
-- ----------------------------
INSERT INTO "public"."sys_roles" VALUES (764654645392969728, '项目管理员', 'project', '', '1', 1, '2025-10-11 01:04:34.081462+00', '2025-10-11 08:07:35.873848+00', NULL);
INSERT INTO "public"."sys_roles" VALUES (764647690360328192, '系统管理员', 'system', '', '1', 2, '2025-10-11 00:36:55.872943+00', '2025-10-11 08:07:42.932446+00', NULL);
INSERT INTO "public"."sys_roles" VALUES (764654591299031040, '合同管理员', 'contract', '', '1', 3, '2025-10-11 01:04:21.183567+00', '2025-10-11 08:07:49.442462+00', NULL);
INSERT INTO "public"."sys_roles" VALUES (1, '超级管理员', 'superadmin', '', '1', 0, '0001-01-01 00:00:00+00', '2025-10-13 10:06:21.796676+00', NULL);

-- ----------------------------
-- Table structure for sys_user_organizations
-- ----------------------------
DROP TABLE IF EXISTS "public"."sys_user_organizations";
CREATE TABLE "public"."sys_user_organizations" (
  "user_id" int8 NOT NULL,
  "organization_id" int8 NOT NULL
)
;

-- ----------------------------
-- Records of sys_user_organizations
-- ----------------------------
INSERT INTO "public"."sys_user_organizations" VALUES (1, 764387777109299200);
INSERT INTO "public"."sys_user_organizations" VALUES (764392867039809536, 764387730745462784);
INSERT INTO "public"."sys_user_organizations" VALUES (764664781314461696, 764387730745462784);
INSERT INTO "public"."sys_user_organizations" VALUES (764668096140021760, 764387730745462784);
INSERT INTO "public"."sys_user_organizations" VALUES (764668270262358016, 764387777109299200);
INSERT INTO "public"."sys_user_organizations" VALUES (764668324779921408, 764387777109299200);
INSERT INTO "public"."sys_user_organizations" VALUES (764782094000852992, 764669202601611264);

-- ----------------------------
-- Table structure for sys_user_roles
-- ----------------------------
DROP TABLE IF EXISTS "public"."sys_user_roles";
CREATE TABLE "public"."sys_user_roles" (
  "user_id" int8 NOT NULL,
  "role_id" int8 NOT NULL
)
;

-- ----------------------------
-- Records of sys_user_roles
-- ----------------------------
INSERT INTO "public"."sys_user_roles" VALUES (1, 1);

-- ----------------------------
-- Table structure for sys_users
-- ----------------------------
DROP TABLE IF EXISTS "public"."sys_users";
CREATE TABLE "public"."sys_users" (
  "id" int8 NOT NULL DEFAULT nextval('users_id_seq'::regclass),
  "username" text COLLATE "pg_catalog"."default" NOT NULL,
  "password" text COLLATE "pg_catalog"."default" NOT NULL,
  "email" text COLLATE "pg_catalog"."default",
  "phone" text COLLATE "pg_catalog"."default",
  "real_name" text COLLATE "pg_catalog"."default",
  "avatar" text COLLATE "pg_catalog"."default",
  "status" text COLLATE "pg_catalog"."default" DEFAULT 1,
  "last_login_at" timestamptz(6),
  "created_at" timestamptz(6),
  "updated_at" timestamptz(6),
  "deleted_at" timestamptz(6),
  "created_by" int8,
  "updated_by" int8,
  "deleted_by" int8
)
;

-- ----------------------------
-- Records of sys_users
-- ----------------------------
INSERT INTO "public"."sys_users" VALUES (764392867039809536, 'zhangsan', '$2a$10$kq.eIgpYHU1Unxhl4XW0b.gNe8JCzr9d8PrzMHsKgmFJSvHULlsyy', 'zhangsan@test.com', '', '', '', '1', NULL, '2025-10-10 07:44:21.325858+00', '2025-10-10 07:44:21.515285+00', '2025-10-10 08:10:47.287094+00', NULL, NULL, NULL);
INSERT INTO "public"."sys_users" VALUES (764668096140021760, 'test02', '$2a$10$lJa3PPGudXZKd31zINvjr.qXqU2.b0jtBWg677OXnmdtF92tBY0qC', NULL, '', '测试人员2', '', '1', NULL, '2025-10-11 01:58:01.058472+00', '2025-10-11 01:58:01.246266+00', NULL, 1, 1, NULL);
INSERT INTO "public"."sys_users" VALUES (764664781314461696, 'test01', '$2a$10$vKrUtiuwyk6MJYss3W.M8udQSOG7zDraLUYnvixkYyV3F91Y38nri', NULL, '', '测试人员1', '', '1', NULL, '2025-10-11 01:44:50.731506+00', '2025-10-11 01:58:09.930143+00', NULL, 1, 1, NULL);
INSERT INTO "public"."sys_users" VALUES (764668324779921408, 'yanfa2', '$2a$10$WuxlUAjTUOzye35hJZ2YwOx6kxzSQiAV.cWR/Q6KVZ5R4x/eIsihu', NULL, '', '研发2', '', '1', NULL, '2025-10-11 01:58:55.558924+00', '2025-10-11 01:58:55.659528+00', NULL, 1, 1, NULL);
INSERT INTO "public"."sys_users" VALUES (764782094000852992, 'liumy', '$2a$10$4ffVQtFlWEl6BmK6DyRDMeEh4gae9KZzl/cXK3PTiKyVVqXYRCyBe', NULL, '', '', '', '1', NULL, '2025-10-11 09:31:00.253103+00', '2025-10-11 09:31:12.044495+00', '2025-10-11 09:31:12.129957+00', 1, 1, 1);
INSERT INTO "public"."sys_users" VALUES (764668270262358016, 'yanfa1', '$2a$10$Lqme9Z3DDFmg9ad3zmjROOpIFEcGY97yq6rv00b6Zjc9WbomeCQF6', NULL, '', '研发1', '', '1', NULL, '2025-10-11 01:58:42.559063+00', '2025-10-13 03:24:22.668526+00', NULL, 1, 1, NULL);
INSERT INTO "public"."sys_users" VALUES (1, 'admin', '$2a$10$vkTXMIaf0a4DRdbG2mIoSuuO/rMBg7taw3uWn.XwyniEgQHKI7.bu', 'dzchengang@126.com', '15650019763', '管理员', '/uploads/avatars/avatar_1_765738979386462208.jpg', '1', NULL, '2025-10-10 03:16:47.452924+00', '2025-10-14 01:04:04.278072+00', NULL, 0, 0, NULL);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."dict_items_id_seq"
OWNED BY "public"."sys_dict_items"."id";
SELECT setval('"public"."dict_items_id_seq"', 4, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."dicts_id_seq"
OWNED BY "public"."sys_dicts"."id";
SELECT setval('"public"."dicts_id_seq"', 3, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."menus_id_seq"
OWNED BY "public"."sys_menus"."id";
SELECT setval('"public"."menus_id_seq"', 1, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."organizations_id_seq"
OWNED BY "public"."sys_organizations"."id";
SELECT setval('"public"."organizations_id_seq"', 11, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."roles_id_seq"
OWNED BY "public"."sys_roles"."id";
SELECT setval('"public"."roles_id_seq"', 1, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."sys_access_logs_id_seq"
OWNED BY "public"."sys_access_logs"."id";
SELECT setval('"public"."sys_access_logs_id_seq"', 71, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."users_id_seq"
OWNED BY "public"."sys_users"."id";
SELECT setval('"public"."users_id_seq"', 1, true);

-- ----------------------------
-- Indexes structure for table sys_access_logs
-- ----------------------------
CREATE INDEX "idx_sys_access_logs_path" ON "public"."sys_access_logs" USING btree (
  "path" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE INDEX "idx_sys_access_logs_status_code" ON "public"."sys_access_logs" USING btree (
  "status_code" "pg_catalog"."int8_ops" ASC NULLS LAST
);
CREATE INDEX "idx_sys_access_logs_username" ON "public"."sys_access_logs" USING btree (
  "username" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table sys_access_logs
-- ----------------------------
ALTER TABLE "public"."sys_access_logs" ADD CONSTRAINT "sys_access_logs_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table sys_dict_items
-- ----------------------------
CREATE INDEX "idx_dict_items_deleted_at" ON "public"."sys_dict_items" USING btree (
  "deleted_at" "pg_catalog"."timestamptz_ops" ASC NULLS LAST
);
CREATE INDEX "idx_sys_dict_items_deleted_at" ON "public"."sys_dict_items" USING btree (
  "deleted_at" "pg_catalog"."timestamptz_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table sys_dict_items
-- ----------------------------
ALTER TABLE "public"."sys_dict_items" ADD CONSTRAINT "dict_items_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table sys_dicts
-- ----------------------------
CREATE UNIQUE INDEX "idx_dicts_code" ON "public"."sys_dicts" USING btree (
  "code" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE INDEX "idx_dicts_deleted_at" ON "public"."sys_dicts" USING btree (
  "deleted_at" "pg_catalog"."timestamptz_ops" ASC NULLS LAST
);
CREATE INDEX "idx_sys_dicts_deleted_at" ON "public"."sys_dicts" USING btree (
  "deleted_at" "pg_catalog"."timestamptz_ops" ASC NULLS LAST
);

-- ----------------------------
-- Uniques structure for table sys_dicts
-- ----------------------------
ALTER TABLE "public"."sys_dicts" ADD CONSTRAINT "idx_sys_dicts_code" UNIQUE ("code");

-- ----------------------------
-- Primary Key structure for table sys_dicts
-- ----------------------------
ALTER TABLE "public"."sys_dicts" ADD CONSTRAINT "dicts_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table sys_menus
-- ----------------------------
CREATE INDEX "idx_menus_deleted_at" ON "public"."sys_menus" USING btree (
  "deleted_at" "pg_catalog"."timestamptz_ops" ASC NULLS LAST
);
CREATE INDEX "idx_sys_menus_deleted_at" ON "public"."sys_menus" USING btree (
  "deleted_at" "pg_catalog"."timestamptz_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table sys_menus
-- ----------------------------
ALTER TABLE "public"."sys_menus" ADD CONSTRAINT "menus_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table sys_organizations
-- ----------------------------
CREATE UNIQUE INDEX "idx_organizations_code" ON "public"."sys_organizations" USING btree (
  "code" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE INDEX "idx_organizations_created_by" ON "public"."sys_organizations" USING btree (
  "created_by" "pg_catalog"."int8_ops" ASC NULLS LAST
);
CREATE INDEX "idx_organizations_deleted_at" ON "public"."sys_organizations" USING btree (
  "deleted_at" "pg_catalog"."timestamptz_ops" ASC NULLS LAST
);
CREATE INDEX "idx_organizations_deleted_by" ON "public"."sys_organizations" USING btree (
  "deleted_by" "pg_catalog"."int8_ops" ASC NULLS LAST
);
CREATE INDEX "idx_organizations_path" ON "public"."sys_organizations" USING btree (
  "path" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE INDEX "idx_organizations_updated_by" ON "public"."sys_organizations" USING btree (
  "updated_by" "pg_catalog"."int8_ops" ASC NULLS LAST
);
CREATE INDEX "idx_sys_organizations_created_by" ON "public"."sys_organizations" USING btree (
  "created_by" "pg_catalog"."int8_ops" ASC NULLS LAST
);
CREATE INDEX "idx_sys_organizations_deleted_at" ON "public"."sys_organizations" USING btree (
  "deleted_at" "pg_catalog"."timestamptz_ops" ASC NULLS LAST
);
CREATE INDEX "idx_sys_organizations_deleted_by" ON "public"."sys_organizations" USING btree (
  "deleted_by" "pg_catalog"."int8_ops" ASC NULLS LAST
);
CREATE INDEX "idx_sys_organizations_path" ON "public"."sys_organizations" USING btree (
  "path" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE INDEX "idx_sys_organizations_updated_by" ON "public"."sys_organizations" USING btree (
  "updated_by" "pg_catalog"."int8_ops" ASC NULLS LAST
);

-- ----------------------------
-- Uniques structure for table sys_organizations
-- ----------------------------
ALTER TABLE "public"."sys_organizations" ADD CONSTRAINT "idx_sys_organizations_code" UNIQUE ("code");

-- ----------------------------
-- Primary Key structure for table sys_organizations
-- ----------------------------
ALTER TABLE "public"."sys_organizations" ADD CONSTRAINT "organizations_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table sys_role_menus
-- ----------------------------
ALTER TABLE "public"."sys_role_menus" ADD CONSTRAINT "role_menus_pkey" PRIMARY KEY ("role_id", "menu_id");

-- ----------------------------
-- Indexes structure for table sys_roles
-- ----------------------------
CREATE UNIQUE INDEX "idx_roles_code" ON "public"."sys_roles" USING btree (
  "code" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE INDEX "idx_roles_deleted_at" ON "public"."sys_roles" USING btree (
  "deleted_at" "pg_catalog"."timestamptz_ops" ASC NULLS LAST
);
CREATE INDEX "idx_sys_roles_deleted_at" ON "public"."sys_roles" USING btree (
  "deleted_at" "pg_catalog"."timestamptz_ops" ASC NULLS LAST
);

-- ----------------------------
-- Uniques structure for table sys_roles
-- ----------------------------
ALTER TABLE "public"."sys_roles" ADD CONSTRAINT "idx_sys_roles_code" UNIQUE ("code");

-- ----------------------------
-- Primary Key structure for table sys_roles
-- ----------------------------
ALTER TABLE "public"."sys_roles" ADD CONSTRAINT "roles_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table sys_user_organizations
-- ----------------------------
ALTER TABLE "public"."sys_user_organizations" ADD CONSTRAINT "user_organizations_pkey" PRIMARY KEY ("user_id", "organization_id");

-- ----------------------------
-- Primary Key structure for table sys_user_roles
-- ----------------------------
ALTER TABLE "public"."sys_user_roles" ADD CONSTRAINT "user_roles_pkey" PRIMARY KEY ("user_id", "role_id");

-- ----------------------------
-- Indexes structure for table sys_users
-- ----------------------------
CREATE INDEX "idx_sys_users_created_by" ON "public"."sys_users" USING btree (
  "created_by" "pg_catalog"."int8_ops" ASC NULLS LAST
);
CREATE INDEX "idx_sys_users_deleted_at" ON "public"."sys_users" USING btree (
  "deleted_at" "pg_catalog"."timestamptz_ops" ASC NULLS LAST
);
CREATE INDEX "idx_sys_users_deleted_by" ON "public"."sys_users" USING btree (
  "deleted_by" "pg_catalog"."int8_ops" ASC NULLS LAST
);
CREATE INDEX "idx_sys_users_updated_by" ON "public"."sys_users" USING btree (
  "updated_by" "pg_catalog"."int8_ops" ASC NULLS LAST
);
CREATE INDEX "idx_users_created_by" ON "public"."sys_users" USING btree (
  "created_by" "pg_catalog"."int8_ops" ASC NULLS LAST
);
CREATE INDEX "idx_users_deleted_at" ON "public"."sys_users" USING btree (
  "deleted_at" "pg_catalog"."timestamptz_ops" ASC NULLS LAST
);
CREATE INDEX "idx_users_deleted_by" ON "public"."sys_users" USING btree (
  "deleted_by" "pg_catalog"."int8_ops" ASC NULLS LAST
);
CREATE UNIQUE INDEX "idx_users_email" ON "public"."sys_users" USING btree (
  "email" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE INDEX "idx_users_updated_by" ON "public"."sys_users" USING btree (
  "updated_by" "pg_catalog"."int8_ops" ASC NULLS LAST
);
CREATE UNIQUE INDEX "idx_users_username" ON "public"."sys_users" USING btree (
  "username" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);

-- ----------------------------
-- Uniques structure for table sys_users
-- ----------------------------
ALTER TABLE "public"."sys_users" ADD CONSTRAINT "idx_sys_users_username" UNIQUE ("username");
ALTER TABLE "public"."sys_users" ADD CONSTRAINT "idx_sys_users_email" UNIQUE ("email");

-- ----------------------------
-- Primary Key structure for table sys_users
-- ----------------------------
ALTER TABLE "public"."sys_users" ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Foreign Keys structure for table sys_dict_items
-- ----------------------------
ALTER TABLE "public"."sys_dict_items" ADD CONSTRAINT "fk_dicts_items" FOREIGN KEY ("dict_id") REFERENCES "public"."sys_dicts" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table sys_menus
-- ----------------------------
ALTER TABLE "public"."sys_menus" ADD CONSTRAINT "fk_menus_children" FOREIGN KEY ("parent_id") REFERENCES "public"."sys_menus" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
