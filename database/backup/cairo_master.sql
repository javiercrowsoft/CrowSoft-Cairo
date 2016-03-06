--
-- PostgreSQL database dump
--

-- Dumped from database version 9.0.10
-- Dumped by pg_dump version 9.1.4
-- Started on 2016-02-28 10:50:08 ART

SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = off;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET escape_string_warning = off;

--
-- TOC entry 469 (class 2612 OID 11574)
-- Name: plpgsql; Type: PROCEDURAL LANGUAGE; Schema: -; Owner: postgres
--

CREATE OR REPLACE PROCEDURAL LANGUAGE plpgsql;


ALTER PROCEDURAL LANGUAGE plpgsql OWNER TO postgres;

SET search_path = public, pg_catalog;

--
-- TOC entry 158 (class 1255 OID 31212)
-- Dependencies: 5
-- Name: getdate(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getdate() RETURNS timestamp with time zone
    LANGUAGE sql STABLE
    AS $$select now()$$;


ALTER FUNCTION public.getdate() OWNER TO postgres;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 147 (class 1259 OID 87054)
-- Dependencies: 1815 1816 1817 5
-- Name: domains; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE domains (
    dm_id integer NOT NULL,
    dm_server character varying(1000) NOT NULL,
    dm_database character varying(1000) NOT NULL,
    dm_username character varying(1000) NOT NULL,
    dm_password character varying(1000) NOT NULL,
    dm_locked smallint DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT getdate() NOT NULL,
    updated_at timestamp with time zone DEFAULT getdate() NOT NULL
);


ALTER TABLE public.domains OWNER TO postgres;

--
-- TOC entry 146 (class 1259 OID 87052)
-- Dependencies: 147 5
-- Name: domains_dm_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE domains_dm_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.domains_dm_id_seq OWNER TO postgres;

--
-- TOC entry 1848 (class 0 OID 0)
-- Dependencies: 146
-- Name: domains_dm_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE domains_dm_id_seq OWNED BY domains.dm_id;


--
-- TOC entry 1849 (class 0 OID 0)
-- Dependencies: 146
-- Name: domains_dm_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('domains_dm_id_seq', 1, true);


--
-- TOC entry 145 (class 1259 OID 64163)
-- Dependencies: 1810 1811 1812 1813 5
-- Name: token; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE token (
    tk_id integer NOT NULL,
    tk_token character varying(1000) NOT NULL,
    tk_expires date NOT NULL,
    tk_type character varying(255) NOT NULL,
    tk_data character varying(5000) NOT NULL,
    tk_used smallint DEFAULT 0 NOT NULL,
    us_id integer,
    tk_platform character varying(255) NOT NULL,
    tk_ip_address character varying(255) NOT NULL,
    tk_user_agent character varying(255) NOT NULL,
    tk_accept_language character varying(255) NOT NULL,
    tk_is_mobile smallint DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT getdate() NOT NULL,
    updated_at timestamp with time zone DEFAULT getdate() NOT NULL
);


ALTER TABLE public.token OWNER TO postgres;

--
-- TOC entry 144 (class 1259 OID 64161)
-- Dependencies: 5 145
-- Name: token_tk_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE token_tk_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.token_tk_id_seq OWNER TO postgres;

--
-- TOC entry 1850 (class 0 OID 0)
-- Dependencies: 144
-- Name: token_tk_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE token_tk_id_seq OWNED BY token.tk_id;


--
-- TOC entry 1851 (class 0 OID 0)
-- Dependencies: 144
-- Name: token_tk_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('token_tk_id_seq', 15, true);


--
-- TOC entry 149 (class 1259 OID 87194)
-- Dependencies: 1819 1820 1821 5
-- Name: user_logins; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE user_logins (
    usl_id integer NOT NULL,
    usl_username character varying(1000) NOT NULL,
    usl_result_code character varying(1000) NOT NULL,
    usl_platform character varying(255) NOT NULL,
    usl_ip_address character varying(255) NOT NULL,
    usl_user_agent character varying(255) NOT NULL,
    usl_accept_language character varying(255) NOT NULL,
    usl_is_mobile smallint DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT getdate() NOT NULL,
    updated_at timestamp with time zone DEFAULT getdate() NOT NULL
);


ALTER TABLE public.user_logins OWNER TO postgres;

--
-- TOC entry 148 (class 1259 OID 87192)
-- Dependencies: 5 149
-- Name: user_logins_usl_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE user_logins_usl_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_logins_usl_id_seq OWNER TO postgres;

--
-- TOC entry 1852 (class 0 OID 0)
-- Dependencies: 148
-- Name: user_logins_usl_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE user_logins_usl_id_seq OWNED BY user_logins.usl_id;


--
-- TOC entry 1853 (class 0 OID 0)
-- Dependencies: 148
-- Name: user_logins_usl_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('user_logins_usl_id_seq', 258, true);


--
-- TOC entry 143 (class 1259 OID 64075)
-- Dependencies: 1804 1805 1806 1807 1808 5
-- Name: users; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE users (
    us_id integer NOT NULL,
    us_username character varying(1000) NOT NULL,
    us_email character varying(1000) NOT NULL,
    us_password character varying(1000) NOT NULL,
    us_code character varying(1000) NOT NULL,
    us_active smallint DEFAULT 1 NOT NULL,
    us_locked smallint DEFAULT 0 NOT NULL,
    us_platform character varying(255) NOT NULL,
    us_ip_address character varying(255) NOT NULL,
    us_user_agent character varying(255) NOT NULL,
    us_accept_language character varying(255) NOT NULL,
    us_is_mobile smallint DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT getdate() NOT NULL,
    updated_at timestamp with time zone DEFAULT getdate() NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 142 (class 1259 OID 64073)
-- Dependencies: 5 143
-- Name: users_us_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE users_us_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_us_id_seq OWNER TO postgres;

--
-- TOC entry 1854 (class 0 OID 0)
-- Dependencies: 142
-- Name: users_us_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE users_us_id_seq OWNED BY users.us_id;


--
-- TOC entry 1855 (class 0 OID 0)
-- Dependencies: 142
-- Name: users_us_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('users_us_id_seq', 12, true);


--
-- TOC entry 1814 (class 2604 OID 87057)
-- Dependencies: 146 147 147
-- Name: dm_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY domains ALTER COLUMN dm_id SET DEFAULT nextval('domains_dm_id_seq'::regclass);


--
-- TOC entry 1809 (class 2604 OID 64166)
-- Dependencies: 144 145 145
-- Name: tk_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY token ALTER COLUMN tk_id SET DEFAULT nextval('token_tk_id_seq'::regclass);


--
-- TOC entry 1818 (class 2604 OID 87197)
-- Dependencies: 148 149 149
-- Name: usl_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY user_logins ALTER COLUMN usl_id SET DEFAULT nextval('user_logins_usl_id_seq'::regclass);


--
-- TOC entry 1803 (class 2604 OID 64078)
-- Dependencies: 143 142 143
-- Name: us_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY users ALTER COLUMN us_id SET DEFAULT nextval('users_us_id_seq'::regclass);


--
-- TOC entry 1841 (class 0 OID 87054)
-- Dependencies: 147
-- Data for Name: domains; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO domains VALUES (1, 'jdbc:postgresql://localhost:5434', 'crowsoft_com_ar_domain', 'postgres', '14FeDyAr', 0, '2014-05-18 20:57:53.600979-03', '2014-05-18 20:57:53.600979-03');
INSERT INTO domains VALUES (2, 'jdbc:postgresql://localhost:5434', 'salmax_com_ar_domain', 'postgres', '14FeDyAr', 0, '2015-09-14 09:25:18.061279-03', '2015-09-14 09:25:18.061279-03');


--
-- TOC entry 1840 (class 0 OID 64163)
-- Dependencies: 145
-- Data for Name: token; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO token VALUES (1, '81efb280db793299a99307881dc496d7f838c058f00b86b6', '2014-05-13', 'PASSWORD_TOKEN', '', 0, 1, 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.131 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-05-11 00:31:36.071963-03', '2014-05-11 00:31:36.071963-03');
INSERT INTO token VALUES (2, '71c897888ee703c30360d429f339ecac0b8fc1e4e332a4e5', '2014-05-13', 'RESET_PASSWORD_TOKEN', '', 0, 1, 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.131 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-05-11 00:35:07.261934-03', '2014-05-11 00:35:07.261934-03');
INSERT INTO token VALUES (3, '553478d97c483119e80811f2e02d10b1ac8f1a657260f941', '2014-05-15', 'RESET_PASSWORD_TOKEN', '', 1, 1, 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.131 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-05-13 15:46:23.703638-03', '2014-05-13 15:46:23.703638-03');
INSERT INTO token VALUES (4, 'dc5f457fe0c9cc5b6d39300d6882cfd2417dbe154eaeabc9', '2014-05-15', 'RESET_PASSWORD_TOKEN', '', 1, 1, 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.131 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-05-13 16:15:31.026761-03', '2014-05-13 16:15:31.026761-03');
INSERT INTO token VALUES (5, '81dda4a270d6f213d589b7262d1ad780851105f7deb7ffae', '2014-05-15', 'RESET_PASSWORD_TOKEN', '', 1, 1, 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.131 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-05-13 17:05:30.694652-03', '2014-05-13 17:05:30.694652-03');
INSERT INTO token VALUES (6, '9856255979b145f8406ebb41e00727bf30c70702a6df8bf8', '2014-05-16', 'RESET_PASSWORD_TOKEN', '', 0, 1, 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.131 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-05-14 12:56:27.009795-03', '2014-05-14 12:56:27.009795-03');
INSERT INTO token VALUES (7, '619a2848db30f7afafdc2ac074db2adb8977d45e47908230', '2014-05-16', 'RESET_PASSWORD_TOKEN', '', 0, 1, 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.131 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-05-14 13:03:55.466891-03', '2014-05-14 13:03:55.466891-03');
INSERT INTO token VALUES (8, '3644907531cd8b291c6658d15b3182bcef8f2b5d513d9810', '2014-05-19', 'RESET_PASSWORD_TOKEN', '', 0, 1, 'iPhone', '192.168.1.36', 'Mozilla/5.0 (iPod; CPU iPhone OS 6_1_3 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10B329 Safari/8536.25', 'List(Lang(en,us))', 1, '2014-05-17 19:14:16.82423-03', '2014-05-17 19:14:16.82423-03');
INSERT INTO token VALUES (9, 'f7bcbec9ecd1f603f465039d89e69c5a199f965e2ae8be75', '2014-05-20', 'RESET_PASSWORD_TOKEN', '', 1, 1, 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-05-18 20:58:24.290653-03', '2014-05-18 20:58:24.290653-03');
INSERT INTO token VALUES (10, '7a8ae05b553cb90af55f1eff3ef77869850c62f4245aa129', '2014-06-02', 'RESET_PASSWORD_TOKEN', '', 1, 1, 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-05-31 00:37:55.920412-03', '2014-05-31 00:37:55.920412-03');
INSERT INTO token VALUES (11, '7830cfafc1555097bda94c8818da01f20cc3beb0abfafd48', '2014-06-03', 'RESET_PASSWORD_TOKEN', '', 1, 1, 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-06-01 11:27:34.320703-03', '2014-06-01 11:27:34.320703-03');
INSERT INTO token VALUES (12, 'd7718a4dc88b8eb55233fb59d375e804c4dbfad6eb74026a', '2014-06-03', 'RESET_PASSWORD_TOKEN', '', 1, 7, 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-06-01 11:31:45.171798-03', '2014-06-01 11:31:45.171798-03');
INSERT INTO token VALUES (13, '8f23c4069c1838c99a709117ab1e4c15f38b6c1f1488df71', '2015-09-16', 'RESET_PASSWORD_TOKEN', '', 0, 1, 'Mac', '0:0:0:0:0:0:0:1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.85 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,), Lang(ja,))', 0, '2015-09-14 13:04:00.914213-03', '2015-09-14 13:04:00.914213-03');
INSERT INTO token VALUES (14, 'b74cf9e904f574e1f1f2e9f22482bac0d731767fad497280', '2015-09-16', 'RESET_PASSWORD_TOKEN', '', 1, 1, 'Mac', '0:0:0:0:0:0:0:1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.85 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,), Lang(ja,))', 0, '2015-09-14 13:15:36.240513-03', '2015-09-14 13:15:36.240513-03');
INSERT INTO token VALUES (15, '710b097de688e17a5723a00a19020e7ee8d2960cc063799d', '2015-10-14', 'RESET_PASSWORD_TOKEN', '', 1, 1, 'Mac', '0:0:0:0:0:0:0:1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,), Lang(ja,), Lang(gl,), Lang(pt,))', 0, '2015-10-12 12:39:36.524578-03', '2015-10-12 12:39:36.524578-03');


--
-- TOC entry 1842 (class 0 OID 87194)
-- Dependencies: 149
-- Data for Name: user_logins; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO user_logins VALUES (1, 'javier2@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-05-19 21:03:18.920206-03', '2014-05-19 21:03:18.920206-03');
INSERT INTO user_logins VALUES (2, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-05-19 21:03:35.160178-03', '2014-05-19 21:03:35.160178-03');
INSERT INTO user_logins VALUES (3, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-05-19 21:27:10.233955-03', '2014-05-19 21:27:10.233955-03');
INSERT INTO user_logins VALUES (4, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-05-19 21:28:56.860826-03', '2014-05-19 21:28:56.860826-03');
INSERT INTO user_logins VALUES (5, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-05-19 21:42:46.910074-03', '2014-05-19 21:42:46.910074-03');
INSERT INTO user_logins VALUES (6, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-05-19 22:09:41.813248-03', '2014-05-19 22:09:41.813248-03');
INSERT INTO user_logins VALUES (7, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-05-19 22:13:43.294371-03', '2014-05-19 22:13:43.294371-03');
INSERT INTO user_logins VALUES (8, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-05-19 22:24:21.868159-03', '2014-05-19 22:24:21.868159-03');
INSERT INTO user_logins VALUES (9, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-05-19 22:27:44.201751-03', '2014-05-19 22:27:44.201751-03');
INSERT INTO user_logins VALUES (10, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-05-19 22:30:03.859605-03', '2014-05-19 22:30:03.859605-03');
INSERT INTO user_logins VALUES (11, 'javier@crowsoft.com.ar', 'SUCCESS', 'iPhone', '192.168.1.33', 'Mozilla/5.0 (iPod; CPU iPhone OS 6_1_3 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10B329 Safari/8536.25', 'List(Lang(en,us))', 1, '2014-05-20 08:48:20.702768-03', '2014-05-20 08:48:20.702768-03');
INSERT INTO user_logins VALUES (12, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-05-20 08:49:08.328798-03', '2014-05-20 08:49:08.328798-03');
INSERT INTO user_logins VALUES (13, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-05-20 08:51:03.960385-03', '2014-05-20 08:51:03.960385-03');
INSERT INTO user_logins VALUES (14, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-05-20 08:52:41.408471-03', '2014-05-20 08:52:41.408471-03');
INSERT INTO user_logins VALUES (15, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-05-20 08:59:24.711011-03', '2014-05-20 08:59:24.711011-03');
INSERT INTO user_logins VALUES (16, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-05-20 09:00:37.606657-03', '2014-05-20 09:00:37.606657-03');
INSERT INTO user_logins VALUES (17, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-05-23 05:04:56.195337-03', '2014-05-23 05:04:56.195337-03');
INSERT INTO user_logins VALUES (18, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-05-26 13:59:03.824666-03', '2014-05-26 13:59:03.824666-03');
INSERT INTO user_logins VALUES (19, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-05-26 16:09:51.280415-03', '2014-05-26 16:09:51.280415-03');
INSERT INTO user_logins VALUES (20, 'javier@crowsoft.com.ar', 'SUCCESS', 'Android', '192.168.1.40', 'Mozilla/5.0 (Linux; U; Android 2.2.1; en-us; GT-I9003L Build/FROYO) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1', 'List(Lang(en,US))', 1, '2014-05-26 16:23:57.495864-03', '2014-05-26 16:23:57.495864-03');
INSERT INTO user_logins VALUES (21, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-05-26 18:27:35.277265-03', '2014-05-26 18:27:35.277265-03');
INSERT INTO user_logins VALUES (22, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-05-26 20:32:49.957086-03', '2014-05-26 20:32:49.957086-03');
INSERT INTO user_logins VALUES (23, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-05-27 17:56:28.487036-03', '2014-05-27 17:56:28.487036-03');
INSERT INTO user_logins VALUES (24, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-05-29 16:03:53.986444-03', '2014-05-29 16:03:53.986444-03');
INSERT INTO user_logins VALUES (25, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-05-30 23:59:06.601876-03', '2014-05-30 23:59:06.601876-03');
INSERT INTO user_logins VALUES (26, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-05-30 23:59:30.342078-03', '2014-05-30 23:59:30.342078-03');
INSERT INTO user_logins VALUES (27, 'javier@crowsoft.com.ar', 'SUCCESS', 'iPhone', '127.0.0.1', 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_2_1 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8C148 Safari/6533.18.5', 'List(Lang(en,US), Lang(en,), Lang(es,))', 1, '2014-05-30 23:59:54.01085-03', '2014-05-30 23:59:54.01085-03');
INSERT INTO user_logins VALUES (28, 'javier@crowsoft.com.ar', 'BAD_PASSWORD', 'iPhone', '192.168.1.33', 'Mozilla/5.0 (iPod; CPU iPhone OS 6_1_3 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10B329 Safari/8536.25', 'List(Lang(en,us))', 1, '2014-05-31 00:37:13.102438-03', '2014-05-31 00:37:13.102438-03');
INSERT INTO user_logins VALUES (29, 'javier@crowsoft.com.ar', 'BAD_PASSWORD', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-05-31 00:37:49.289884-03', '2014-05-31 00:37:49.289884-03');
INSERT INTO user_logins VALUES (30, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-05-31 00:38:31.705149-03', '2014-05-31 00:38:31.705149-03');
INSERT INTO user_logins VALUES (31, 'javier@crowsoft.com.ar', 'BAD_PASSWORD', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-05-31 00:38:37.177431-03', '2014-05-31 00:38:37.177431-03');
INSERT INTO user_logins VALUES (32, 'javier2@crowsoft.com.ar', 'BAD_PASSWORD', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-05-31 00:38:49.017155-03', '2014-05-31 00:38:49.017155-03');
INSERT INTO user_logins VALUES (34, 'javier@crowsoft.com.ar', 'SUCCESS', 'iPhone', '192.168.1.33', 'Mozilla/5.0 (iPod; CPU iPhone OS 6_1_3 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10B329 Safari/8536.25', 'List(Lang(en,us))', 1, '2014-05-31 00:39:25.006394-03', '2014-05-31 00:39:25.006394-03');
INSERT INTO user_logins VALUES (36, 'javier@crowsoft.com.ar', 'SUCCESS', 'Android', '192.168.1.40', 'Mozilla/5.0 (Linux; U; Android 2.2.1; en-us; GT-I9003L Build/FROYO) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1', 'List(Lang(en,US))', 1, '2014-05-31 00:47:17.609791-03', '2014-05-31 00:47:17.609791-03');
INSERT INTO user_logins VALUES (33, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-05-31 00:39:03.611656-03', '2014-05-31 00:39:03.611656-03');
INSERT INTO user_logins VALUES (35, 'javier@crowsoft.com.ar', 'BAD_PASSWORD', 'Android', '192.168.1.40', 'Mozilla/5.0 (Linux; U; Android 2.2.1; en-us; GT-I9003L Build/FROYO) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1', 'List(Lang(en,US))', 1, '2014-05-31 00:46:40.747581-03', '2014-05-31 00:46:40.747581-03');
INSERT INTO user_logins VALUES (37, 'javier@crowsoft.com.ar', 'BAD_PASSWORD', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-05-31 10:46:24.522452-03', '2014-05-31 10:46:24.522452-03');
INSERT INTO user_logins VALUES (38, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-05-31 10:46:33.831065-03', '2014-05-31 10:46:33.831065-03');
INSERT INTO user_logins VALUES (39, 'javier@crowsoft.com.ar', 'BAD_PASSWORD', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-05-31 10:47:05.497791-03', '2014-05-31 10:47:05.497791-03');
INSERT INTO user_logins VALUES (40, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-05-31 10:47:14.691474-03', '2014-05-31 10:47:14.691474-03');
INSERT INTO user_logins VALUES (41, 'javier@crowsoft.com.ar', 'BAD_PASSWORD', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-05-31 11:11:24.934606-03', '2014-05-31 11:11:24.934606-03');
INSERT INTO user_logins VALUES (42, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-05-31 11:11:33.97269-03', '2014-05-31 11:11:33.97269-03');
INSERT INTO user_logins VALUES (43, 'javier@crowsoft.com.ar', 'SUCCESS', 'Android', '192.168.1.40', 'Mozilla/5.0 (Linux; U; Android 2.2.1; en-us; GT-I9003L Build/FROYO) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1', 'List(Lang(en,US))', 1, '2014-05-31 11:26:34.71416-03', '2014-05-31 11:26:34.71416-03');
INSERT INTO user_logins VALUES (44, 'javier@crowsoft.com.ar', 'BAD_PASSWORD', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-05-31 19:41:05.454335-03', '2014-05-31 19:41:05.454335-03');
INSERT INTO user_logins VALUES (45, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-05-31 19:41:14.27769-03', '2014-05-31 19:41:14.27769-03');
INSERT INTO user_logins VALUES (46, 'javier@crowsoft.com.ar', 'BAD_PASSWORD', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-06-01 11:26:56.600384-03', '2014-06-01 11:26:56.600384-03');
INSERT INTO user_logins VALUES (47, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-06-01 11:27:09.184247-03', '2014-06-01 11:27:09.184247-03');
INSERT INTO user_logins VALUES (48, 'javier@crowsoft.com.ar', 'BAD_PASSWORD', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-06-01 11:27:19.288184-03', '2014-06-01 11:27:19.288184-03');
INSERT INTO user_logins VALUES (49, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-06-01 11:28:01.418137-03', '2014-06-01 11:28:01.418137-03');
INSERT INTO user_logins VALUES (50, 'javier@crowsoft.com.ar', 'BAD_PASSWORD', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-06-01 11:28:06.124989-03', '2014-06-01 11:28:06.124989-03');
INSERT INTO user_logins VALUES (51, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-06-01 11:28:19.426875-03', '2014-06-01 11:28:19.426875-03');
INSERT INTO user_logins VALUES (52, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-06-01 11:28:21.879391-03', '2014-06-01 11:28:21.879391-03');
INSERT INTO user_logins VALUES (53, 'javier2@crowsoft.com.ar', 'BAD_PASSWORD', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-06-01 11:31:30.470376-03', '2014-06-01 11:31:30.470376-03');
INSERT INTO user_logins VALUES (54, 'javier2@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-06-01 11:32:10.214802-03', '2014-06-01 11:32:10.214802-03');
INSERT INTO user_logins VALUES (55, 'javier2@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-06-01 19:27:17.70568-03', '2014-06-01 19:27:17.70568-03');
INSERT INTO user_logins VALUES (56, 'javier2@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-06-01 19:49:16.332443-03', '2014-06-01 19:49:16.332443-03');
INSERT INTO user_logins VALUES (57, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-06-01 20:30:06.033165-03', '2014-06-01 20:30:06.033165-03');
INSERT INTO user_logins VALUES (58, 'javier2@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-06-01 20:30:24.545017-03', '2014-06-01 20:30:24.545017-03');
INSERT INTO user_logins VALUES (59, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-06-01 20:31:32.62298-03', '2014-06-01 20:31:32.62298-03');
INSERT INTO user_logins VALUES (60, 'javier@crowsoft.com.ar', 'BAD_PASSWORD', 'Android', '192.168.1.40', 'Mozilla/5.0 (Linux; U; Android 2.2.1; en-us; GT-I9003L Build/FROYO) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1', 'List(Lang(en,US))', 1, '2014-06-06 12:10:40.108902-03', '2014-06-06 12:10:40.108902-03');
INSERT INTO user_logins VALUES (61, 'javier@crowsoft.com.ar', 'SUCCESS', 'Android', '192.168.1.40', 'Mozilla/5.0 (Linux; U; Android 2.2.1; en-us; GT-I9003L Build/FROYO) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1', 'List(Lang(en,US))', 1, '2014-06-06 12:10:59.243772-03', '2014-06-06 12:10:59.243772-03');
INSERT INTO user_logins VALUES (62, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '192.168.1.38', 'Mozilla/5.0 (iPad; CPU OS 7_0_4 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11B554a Safari/9537.53', 'List(Lang(en,us))', 1, '2014-06-06 12:57:43.557927-03', '2014-06-06 12:57:43.557927-03');
INSERT INTO user_logins VALUES (63, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.74.9 (KHTML, like Gecko) Version/6.1.2 Safari/537.74.9', 'List(Lang(en,us))', 0, '2014-06-10 13:49:25.651561-03', '2014-06-10 13:49:25.651561-03');
INSERT INTO user_logins VALUES (64, 'javier@crowsoft.com.ar', 'BAD_PASSWORD', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.7; rv:29.0) Gecko/20100101 Firefox/29.0', 'List(Lang(en,US), Lang(en,))', 0, '2014-06-10 13:50:48.760014-03', '2014-06-10 13:50:48.760014-03');
INSERT INTO user_logins VALUES (65, 'javier@crowsoft.com.ar', 'BAD_PASSWORD', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.7; rv:29.0) Gecko/20100101 Firefox/29.0', 'List(Lang(en,US), Lang(en,))', 0, '2014-06-10 13:50:55.474841-03', '2014-06-10 13:50:55.474841-03');
INSERT INTO user_logins VALUES (66, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.7; rv:29.0) Gecko/20100101 Firefox/29.0', 'List(Lang(en,US), Lang(en,))', 0, '2014-06-10 13:51:05.217428-03', '2014-06-10 13:51:05.217428-03');
INSERT INTO user_logins VALUES (67, 'javier@crowsoft.com.ar', 'SUCCESS', 'Windows', '192.168.1.35', 'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko', 'List(Lang(es,AR))', 0, '2014-06-10 14:01:39.096306-03', '2014-06-10 14:01:39.096306-03');
INSERT INTO user_logins VALUES (68, 'javier@crowsoft.com.ar', 'SUCCESS', 'Windows', '192.168.1.35', 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:29.0) Gecko/20100101 Firefox/29.0', 'List(Lang(en,US), Lang(en,))', 0, '2014-06-10 14:08:39.480545-03', '2014-06-10 14:08:39.480545-03');
INSERT INTO user_logins VALUES (69, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.114 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-06-10 14:54:03.812667-03', '2014-06-10 14:54:03.812667-03');
INSERT INTO user_logins VALUES (70, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.114 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-06-10 14:54:07.393111-03', '2014-06-10 14:54:07.393111-03');
INSERT INTO user_logins VALUES (71, 'javier2@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.74.9 (KHTML, like Gecko) Version/6.1.2 Safari/537.74.9', 'List(Lang(en,us))', 0, '2014-06-10 14:55:58.022209-03', '2014-06-10 14:55:58.022209-03');
INSERT INTO user_logins VALUES (72, 'javier2@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.74.9 (KHTML, like Gecko) Version/6.1.2 Safari/537.74.9', 'List(Lang(en,us))', 0, '2014-06-10 14:56:14.421821-03', '2014-06-10 14:56:14.421821-03');
INSERT INTO user_logins VALUES (73, 'javier2@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.74.9 (KHTML, like Gecko) Version/6.1.2 Safari/537.74.9', 'List(Lang(en,us))', 0, '2014-06-10 14:56:29.073053-03', '2014-06-10 14:56:29.073053-03');
INSERT INTO user_logins VALUES (74, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.114 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-06-10 16:52:07.244578-03', '2014-06-10 16:52:07.244578-03');
INSERT INTO user_logins VALUES (75, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.114 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-06-10 16:52:22.294839-03', '2014-06-10 16:52:22.294839-03');
INSERT INTO user_logins VALUES (76, 'javier2@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.74.9 (KHTML, like Gecko) Version/6.1.2 Safari/537.74.9', 'List(Lang(en,us))', 0, '2014-06-10 16:52:32.15792-03', '2014-06-10 16:52:32.15792-03');
INSERT INTO user_logins VALUES (77, 'javier2@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.74.9 (KHTML, like Gecko) Version/6.1.2 Safari/537.74.9', 'List(Lang(en,us))', 0, '2014-06-10 16:55:09.427542-03', '2014-06-10 16:55:09.427542-03');
INSERT INTO user_logins VALUES (78, 'javier2@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.74.9 (KHTML, like Gecko) Version/6.1.2 Safari/537.74.9', 'List(Lang(en,us))', 0, '2014-06-10 18:00:37.787768-03', '2014-06-10 18:00:37.787768-03');
INSERT INTO user_logins VALUES (79, 'javier2@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.74.9 (KHTML, like Gecko) Version/6.1.2 Safari/537.74.9', 'List(Lang(en,us))', 0, '2014-06-10 18:15:11.798773-03', '2014-06-10 18:15:11.798773-03');
INSERT INTO user_logins VALUES (80, 'javier2@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.74.9 (KHTML, like Gecko) Version/6.1.2 Safari/537.74.9', 'List(Lang(en,us))', 0, '2014-06-10 18:15:39.435839-03', '2014-06-10 18:15:39.435839-03');
INSERT INTO user_logins VALUES (81, 'javier2@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.74.9 (KHTML, like Gecko) Version/6.1.2 Safari/537.74.9', 'List(Lang(en,us))', 0, '2014-06-10 18:22:21.435287-03', '2014-06-10 18:22:21.435287-03');
INSERT INTO user_logins VALUES (82, 'javier2@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.74.9 (KHTML, like Gecko) Version/6.1.2 Safari/537.74.9', 'List(Lang(en,us))', 0, '2014-06-10 18:23:27.96183-03', '2014-06-10 18:23:27.96183-03');
INSERT INTO user_logins VALUES (83, 'javier2@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.74.9 (KHTML, like Gecko) Version/6.1.2 Safari/537.74.9', 'List(Lang(en,us))', 0, '2014-06-10 18:24:50.941877-03', '2014-06-10 18:24:50.941877-03');
INSERT INTO user_logins VALUES (84, 'javier2@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.74.9 (KHTML, like Gecko) Version/6.1.2 Safari/537.74.9', 'List(Lang(en,us))', 0, '2014-06-10 18:28:58.604961-03', '2014-06-10 18:28:58.604961-03');
INSERT INTO user_logins VALUES (85, 'javier2@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.74.9 (KHTML, like Gecko) Version/6.1.2 Safari/537.74.9', 'List(Lang(en,us))', 0, '2014-06-10 18:29:32.175988-03', '2014-06-10 18:29:32.175988-03');
INSERT INTO user_logins VALUES (86, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.74.9 (KHTML, like Gecko) Version/6.1.2 Safari/537.74.9', 'List(Lang(en,us))', 0, '2014-06-10 18:30:19.029695-03', '2014-06-10 18:30:19.029695-03');
INSERT INTO user_logins VALUES (87, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.74.9 (KHTML, like Gecko) Version/6.1.2 Safari/537.74.9', 'List(Lang(en,us))', 0, '2014-06-10 18:30:35.445172-03', '2014-06-10 18:30:35.445172-03');
INSERT INTO user_logins VALUES (88, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.74.9 (KHTML, like Gecko) Version/6.1.2 Safari/537.74.9', 'List(Lang(en,us))', 0, '2014-06-10 18:30:40.368501-03', '2014-06-10 18:30:40.368501-03');
INSERT INTO user_logins VALUES (89, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.74.9 (KHTML, like Gecko) Version/6.1.2 Safari/537.74.9', 'List(Lang(en,us))', 0, '2014-06-10 18:30:42.891278-03', '2014-06-10 18:30:42.891278-03');
INSERT INTO user_logins VALUES (90, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.74.9 (KHTML, like Gecko) Version/6.1.2 Safari/537.74.9', 'List(Lang(en,us))', 0, '2014-06-10 18:31:09.307337-03', '2014-06-10 18:31:09.307337-03');
INSERT INTO user_logins VALUES (91, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.74.9 (KHTML, like Gecko) Version/6.1.2 Safari/537.74.9', 'List(Lang(en,us))', 0, '2014-06-10 18:38:34.084482-03', '2014-06-10 18:38:34.084482-03');
INSERT INTO user_logins VALUES (92, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.74.9 (KHTML, like Gecko) Version/6.1.2 Safari/537.74.9', 'List(Lang(en,us))', 0, '2014-06-10 18:38:58.14838-03', '2014-06-10 18:38:58.14838-03');
INSERT INTO user_logins VALUES (93, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.74.9 (KHTML, like Gecko) Version/6.1.2 Safari/537.74.9', 'List(Lang(en,us))', 0, '2014-06-10 18:39:48.647083-03', '2014-06-10 18:39:48.647083-03');
INSERT INTO user_logins VALUES (94, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.74.9 (KHTML, like Gecko) Version/6.1.2 Safari/537.74.9', 'List(Lang(en,us))', 0, '2014-06-10 18:40:17.47685-03', '2014-06-10 18:40:17.47685-03');
INSERT INTO user_logins VALUES (95, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.114 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-06-11 13:18:39.833255-03', '2014-06-11 13:18:39.833255-03');
INSERT INTO user_logins VALUES (96, 'javier@crowsoft.com.ar', 'BAD_PASSWORD', 'Windows', '192.168.1.34', 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.0; Trident/5.0; BOIE9;ENUS)', 'List(Lang(en,us))', 0, '2014-06-11 16:34:33.4749-03', '2014-06-11 16:34:33.4749-03');
INSERT INTO user_logins VALUES (97, 'javier@crowsoft.com.ar', 'SUCCESS', 'Windows', '192.168.1.34', 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.0; Trident/5.0; BOIE9;ENUS)', 'List(Lang(en,us))', 0, '2014-06-11 16:34:45.427149-03', '2014-06-11 16:34:45.427149-03');
INSERT INTO user_logins VALUES (98, 'javier@crowsoft.com.ar', 'SUCCESS', 'Windows', '192.168.1.34', 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.0; Trident/5.0; BOIE9;ENUS)', 'List(Lang(en,us))', 0, '2014-06-11 16:35:07.531657-03', '2014-06-11 16:35:07.531657-03');
INSERT INTO user_logins VALUES (99, 'javier@crowsoft.com.ar', 'SUCCESS', 'Windows', '192.168.1.34', 'Mozilla/5.0 (Windows NT 6.0; rv:2.0.1) Gecko/20100101 Firefox/4.0.1', 'List(Lang(en,us), Lang(en,))', 0, '2014-06-11 16:36:35.318426-03', '2014-06-11 16:36:35.318426-03');
INSERT INTO user_logins VALUES (100, 'javier@crowsoft.com.ar', 'BAD_PASSWORD', 'iPhone', '192.168.1.33', 'Mozilla/5.0 (iPod; CPU iPhone OS 6_1_3 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10B329 Safari/8536.25', 'List(Lang(en,us))', 1, '2014-06-12 13:46:16.104549-03', '2014-06-12 13:46:16.104549-03');
INSERT INTO user_logins VALUES (133, 'javier@crowsoft.com.ar', 'SUCCESS', 'Windows', '192.168.1.34', 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko', 'List(Lang(en,US))', 0, '2014-08-06 10:50:38.824259-03', '2014-08-06 10:50:38.824259-03');
INSERT INTO user_logins VALUES (101, 'javier@crowsoft.com.ar', 'BAD_PASSWORD', 'iPhone', '192.168.1.33', 'Mozilla/5.0 (iPod; CPU iPhone OS 6_1_3 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10B329 Safari/8536.25', 'List(Lang(en,us))', 1, '2014-06-12 13:47:21.591589-03', '2014-06-12 13:47:21.591589-03');
INSERT INTO user_logins VALUES (102, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.114 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-06-13 15:00:07.635688-03', '2014-06-13 15:00:07.635688-03');
INSERT INTO user_logins VALUES (103, 'javier@crowsoft.com.ar', 'SUCCESS', 'iPhone', '192.168.1.33', 'Mozilla/5.0 (iPod; CPU iPhone OS 6_1_3 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10B329 Safari/8536.25', 'List(Lang(en,us))', 1, '2014-06-13 15:16:58.832939-03', '2014-06-13 15:16:58.832939-03');
INSERT INTO user_logins VALUES (104, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.75.14 (KHTML, like Gecko) Version/7.0.3 Safari/537.75.14', 'List(Lang(en,us))', 0, '2014-06-17 14:58:29.651407-03', '2014-06-17 14:58:29.651407-03');
INSERT INTO user_logins VALUES (105, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:29.0) Gecko/20100101 Firefox/29.0', 'List(Lang(en,US), Lang(en,))', 0, '2014-06-17 15:04:28.469165-03', '2014-06-17 15:04:28.469165-03');
INSERT INTO user_logins VALUES (106, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-06-23 20:18:39.445489-03', '2014-06-23 20:18:39.445489-03');
INSERT INTO user_logins VALUES (107, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-06-23 20:18:46.523432-03', '2014-06-23 20:18:46.523432-03');
INSERT INTO user_logins VALUES (108, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-06-26 11:27:12.564648-03', '2014-06-26 11:27:12.564648-03');
INSERT INTO user_logins VALUES (109, 'javier@crowsoft.com.ar', 'SUCCESS', 'Windows', '192.168.1.33', 'Mozilla/5.0 (Windows NT 5.1; rv:30.0) Gecko/20100101 Firefox/30.0', 'List(Lang(en,US), Lang(en,))', 0, '2014-06-26 14:20:50.224173-03', '2014-06-26 14:20:50.224173-03');
INSERT INTO user_logins VALUES (110, 'javier@crowsoft.com.ar', 'SUCCESS', 'Windows', '192.168.1.34', 'Mozilla/5.0 (Windows NT 6.0; rv:2.0.1) Gecko/20100101 Firefox/4.0.1', 'List(Lang(en,us), Lang(en,))', 0, '2014-06-26 14:29:55.356855-03', '2014-06-26 14:29:55.356855-03');
INSERT INTO user_logins VALUES (111, 'javier@crowsoft.com.ar', 'SUCCESS', 'Windows', '192.168.1.34', 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.0; Trident/5.0; BOIE9;ENUS)', 'List(Lang(en,us))', 0, '2014-06-26 14:31:15.674243-03', '2014-06-26 14:31:15.674243-03');
INSERT INTO user_logins VALUES (112, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:29.0) Gecko/20100101 Firefox/29.0', 'List(Lang(en,US), Lang(en,))', 0, '2014-06-26 14:37:21.923369-03', '2014-06-26 14:37:21.923369-03');
INSERT INTO user_logins VALUES (113, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.76.4 (KHTML, like Gecko) Version/7.0.4 Safari/537.76.4', 'List(Lang(en,us))', 0, '2014-06-26 15:04:19.226516-03', '2014-06-26 15:04:19.226516-03');
INSERT INTO user_logins VALUES (114, 'javier@crowsoft.com.ar', 'SUCCESS', 'Windows', '192.168.1.33', 'Mozilla/5.0 (Windows NT 5.1; rv:30.0) Gecko/20100101 Firefox/30.0', 'List(Lang(en,US), Lang(en,))', 0, '2014-06-27 10:13:04.260401-03', '2014-06-27 10:13:04.260401-03');
INSERT INTO user_logins VALUES (115, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-06-27 20:38:48.18622-03', '2014-06-27 20:38:48.18622-03');
INSERT INTO user_logins VALUES (116, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-06-27 20:53:12.779767-03', '2014-06-27 20:53:12.779767-03');
INSERT INTO user_logins VALUES (117, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-06-27 21:07:14.159994-03', '2014-06-27 21:07:14.159994-03');
INSERT INTO user_logins VALUES (118, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-06-27 21:07:47.937845-03', '2014-06-27 21:07:47.937845-03');
INSERT INTO user_logins VALUES (119, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-06-27 21:09:27.560427-03', '2014-06-27 21:09:27.560427-03');
INSERT INTO user_logins VALUES (120, 'javier@crowsoft.com.ar', 'SUCCESS', 'iPhone', '127.0.0.1', 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_2_1 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8C148 Safari/6533.18.5', 'List(Lang(en,US), Lang(en,), Lang(es,))', 1, '2014-06-27 21:13:02.379095-03', '2014-06-27 21:13:02.379095-03');
INSERT INTO user_logins VALUES (121, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-06-27 21:18:14.324015-03', '2014-06-27 21:18:14.324015-03');
INSERT INTO user_logins VALUES (122, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-06-29 18:37:16.84543-03', '2014-06-29 18:37:16.84543-03');
INSERT INTO user_logins VALUES (123, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '192.168.1.36', 'Mozilla/5.0 (iPad; CPU OS 7_0_4 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11B554a Safari/9537.53', 'List(Lang(en,us))', 1, '2014-06-30 21:19:37.499687-03', '2014-06-30 21:19:37.499687-03');
INSERT INTO user_logins VALUES (124, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-07-02 12:40:46.606134-03', '2014-07-02 12:40:46.606134-03');
INSERT INTO user_logins VALUES (125, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:29.0) Gecko/20100101 Firefox/29.0', 'List(Lang(en,US), Lang(en,))', 0, '2014-07-03 08:27:39.52712-03', '2014-07-03 08:27:39.52712-03');
INSERT INTO user_logins VALUES (126, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.76.4 (KHTML, like Gecko) Version/7.0.4 Safari/537.76.4', 'List(Lang(en,us))', 0, '2014-07-03 08:29:49.606291-03', '2014-07-03 08:29:49.606291-03');
INSERT INTO user_logins VALUES (127, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-07-10 14:46:44.879313-03', '2014-07-10 14:46:44.879313-03');
INSERT INTO user_logins VALUES (128, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-07-10 15:46:54.723943-03', '2014-07-10 15:46:54.723943-03');
INSERT INTO user_logins VALUES (129, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-07-11 10:57:43.510709-03', '2014-07-11 10:57:43.510709-03');
INSERT INTO user_logins VALUES (130, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.125 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-08-04 14:46:03.90688-03', '2014-08-04 14:46:03.90688-03');
INSERT INTO user_logins VALUES (131, 'javier@crowsoft.com.r', 'NO_USER', 'Windows', '192.168.1.34', 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko', 'List(Lang(en,US))', 0, '2014-08-06 10:48:22.229545-03', '2014-08-06 10:48:22.229545-03');
INSERT INTO user_logins VALUES (132, 'javier@crowsoft.com.ar', 'BAD_PASSWORD', 'Windows', '192.168.1.34', 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko', 'List(Lang(en,US))', 0, '2014-08-06 10:48:35.76053-03', '2014-08-06 10:48:35.76053-03');
INSERT INTO user_logins VALUES (134, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:29.0) Gecko/20100101 Firefox/29.0', 'List(Lang(en,US), Lang(en,))', 0, '2014-08-06 15:31:07.926227-03', '2014-08-06 15:31:07.926227-03');
INSERT INTO user_logins VALUES (135, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:29.0) Gecko/20100101 Firefox/29.0', 'List(Lang(en,US), Lang(en,))', 0, '2014-08-08 15:56:23.128726-03', '2014-08-08 15:56:23.128726-03');
INSERT INTO user_logins VALUES (136, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.76.4 (KHTML, like Gecko) Version/7.0.4 Safari/537.76.4', 'List(Lang(en,us))', 0, '2014-08-08 15:58:22.830616-03', '2014-08-08 15:58:22.830616-03');
INSERT INTO user_logins VALUES (137, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.125 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-08-08 16:50:52.381199-03', '2014-08-08 16:50:52.381199-03');
INSERT INTO user_logins VALUES (138, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.125 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-08-10 11:06:37.006535-03', '2014-08-10 11:06:37.006535-03');
INSERT INTO user_logins VALUES (139, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:30.0) Gecko/20100101 Firefox/30.0 FirePHP/0.7.4', 'List(Lang(en,US), Lang(en,))', 0, '2014-08-24 21:50:24.715125-03', '2014-08-24 21:50:24.715125-03');
INSERT INTO user_logins VALUES (140, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:30.0) Gecko/20100101 Firefox/30.0', 'List(Lang(en,US), Lang(en,))', 0, '2014-08-24 21:58:46.993674-03', '2014-08-24 21:58:46.993674-03');
INSERT INTO user_logins VALUES (141, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.94 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-08-30 12:49:37.258162-03', '2014-08-30 12:49:37.258162-03');
INSERT INTO user_logins VALUES (142, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.94 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-08-30 16:01:44.528459-03', '2014-08-30 16:01:44.528459-03');
INSERT INTO user_logins VALUES (143, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.94 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-08-30 16:20:11.761905-03', '2014-08-30 16:20:11.761905-03');
INSERT INTO user_logins VALUES (144, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.94 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-08-30 19:43:18.994413-03', '2014-08-30 19:43:18.994413-03');
INSERT INTO user_logins VALUES (145, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.104 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-10-31 11:37:53.323486-03', '2014-10-31 11:37:53.323486-03');
INSERT INTO user_logins VALUES (146, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:31.0) Gecko/20100101 Firefox/31.0', 'List(Lang(en,US), Lang(en,))', 0, '2014-11-14 20:24:51.074047-03', '2014-11-14 20:24:51.074047-03');
INSERT INTO user_logins VALUES (147, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/600.1.17 (KHTML, like Gecko) Version/7.1 Safari/537.85.10', 'List(Lang(en,us))', 0, '2014-11-14 20:25:44.628611-03', '2014-11-14 20:25:44.628611-03');
INSERT INTO user_logins VALUES (148, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.122 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-11-20 21:44:24.627713-03', '2014-11-20 21:44:24.627713-03');
INSERT INTO user_logins VALUES (149, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.122 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-11-21 12:14:31.376992-03', '2014-11-21 12:14:31.376992-03');
INSERT INTO user_logins VALUES (150, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.122 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-11-21 13:50:05.532546-03', '2014-11-21 13:50:05.532546-03');
INSERT INTO user_logins VALUES (151, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.122 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-11-21 13:52:27.837683-03', '2014-11-21 13:52:27.837683-03');
INSERT INTO user_logins VALUES (152, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.122 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-11-21 15:34:05.247469-03', '2014-11-21 15:34:05.247469-03');
INSERT INTO user_logins VALUES (153, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.122 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-11-21 15:39:26.736537-03', '2014-11-21 15:39:26.736537-03');
INSERT INTO user_logins VALUES (154, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.122 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-11-21 15:41:07.642421-03', '2014-11-21 15:41:07.642421-03');
INSERT INTO user_logins VALUES (155, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.122 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-11-21 15:52:32.602826-03', '2014-11-21 15:52:32.602826-03');
INSERT INTO user_logins VALUES (156, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.122 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-11-21 16:02:19.181973-03', '2014-11-21 16:02:19.181973-03');
INSERT INTO user_logins VALUES (157, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.122 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-11-21 16:12:15.0989-03', '2014-11-21 16:12:15.0989-03');
INSERT INTO user_logins VALUES (158, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.122 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-11-22 12:43:26.781353-03', '2014-11-22 12:43:26.781353-03');
INSERT INTO user_logins VALUES (159, 'javier@crowsoft.com.ar', 'SUCCESS', 'Windows', '192.168.1.37', 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:34.0) Gecko/20100101 Firefox/34.0', 'List(Lang(en,US), Lang(en,))', 0, '2014-12-29 14:56:27.755171-03', '2014-12-29 14:56:27.755171-03');
INSERT INTO user_logins VALUES (160, 'javier@crowsoft.com.ar', 'SUCCESS', 'iPhone', '192.168.1.36', 'Mozilla/5.0 (iPod; CPU iPhone OS 6_1_6 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10B500 Safari/8536.25', 'List(Lang(en,us))', 1, '2014-12-29 19:43:19.633401-03', '2014-12-29 19:43:19.633401-03');
INSERT INTO user_logins VALUES (161, 'javier@crowsoft.com.ar', 'SUCCESS', 'iPad', '192.168.1.34', 'Mozilla/5.0 (iPad; CPU OS 7_0_4 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11B554a Safari/9537.53', 'List(Lang(en,us))', 0, '2014-12-29 19:47:45.692224-03', '2014-12-29 19:47:45.692224-03');
INSERT INTO user_logins VALUES (162, 'javier@crowsoft.com.ar', 'BAD_PASSWORD', 'Windows', '192.168.1.38', 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:34.0) Gecko/20100101 Firefox/34.0', 'List(Lang(en,US), Lang(en,))', 0, '2015-01-05 18:08:50.994399-03', '2015-01-05 18:08:50.994399-03');
INSERT INTO user_logins VALUES (163, 'javier@crowsoft.com.ar', 'SUCCESS', 'Windows', '192.168.1.38', 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:34.0) Gecko/20100101 Firefox/34.0', 'List(Lang(en,US), Lang(en,))', 0, '2015-01-05 18:09:25.087264-03', '2015-01-05 18:09:25.087264-03');
INSERT INTO user_logins VALUES (164, 'javier@crowsoft.com.ar', 'SUCCESS', 'Android', '192.168.1.41', 'Mozilla/5.0 (Linux; U; Android 2.2.1; en-us; GT-I9003L Build/FROYO) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1', 'List(Lang(en,US))', 1, '2015-01-05 18:12:53.966746-03', '2015-01-05 18:12:53.966746-03');
INSERT INTO user_logins VALUES (165, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2015-01-12 10:27:03.858134-03', '2015-01-12 10:27:03.858134-03');
INSERT INTO user_logins VALUES (166, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2015-01-12 10:42:03.337221-03', '2015-01-12 10:42:03.337221-03');
INSERT INTO user_logins VALUES (167, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2015-01-12 11:47:03.94649-03', '2015-01-12 11:47:03.94649-03');
INSERT INTO user_logins VALUES (168, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2015-01-12 11:48:22.571312-03', '2015-01-12 11:48:22.571312-03');
INSERT INTO user_logins VALUES (169, 'javier@crowsoft.com.ar', 'SUCCESS', 'Windows', '192.168.1.37', 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:34.0) Gecko/20100101 Firefox/34.0', 'List(Lang(en,US), Lang(en,))', 0, '2015-01-13 11:36:54.320321-03', '2015-01-13 11:36:54.320321-03');
INSERT INTO user_logins VALUES (170, 'javier@crowsoft.com.ar', 'BAD_PASSWORD', 'Windows', '192.168.1.37', 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36', 'List(Lang(es,ES), Lang(es,))', 0, '2015-01-13 11:42:07.335796-03', '2015-01-13 11:42:07.335796-03');
INSERT INTO user_logins VALUES (171, 'javier@crowsoft.com.ar', 'SUCCESS', 'Windows', '192.168.1.37', 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36', 'List(Lang(es,ES), Lang(es,))', 0, '2015-01-13 11:42:24.080244-03', '2015-01-13 11:42:24.080244-03');
INSERT INTO user_logins VALUES (172, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:33.0) Gecko/20100101 Firefox/33.0', 'List(Lang(en,US), Lang(en,))', 0, '2015-01-13 11:50:48.266485-03', '2015-01-13 11:50:48.266485-03');
INSERT INTO user_logins VALUES (173, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/600.1.17 (KHTML, like Gecko) Version/7.1 Safari/537.85.10', 'List(Lang(en,us))', 0, '2015-01-13 12:21:24.702194-03', '2015-01-13 12:21:24.702194-03');
INSERT INTO user_logins VALUES (174, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:34.0) Gecko/20100101 Firefox/34.0', 'List(Lang(en,US), Lang(en,))', 0, '2015-01-13 12:22:33.741445-03', '2015-01-13 12:22:33.741445-03');
INSERT INTO user_logins VALUES (175, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.111 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2015-02-17 10:43:53.437128-03', '2015-02-17 10:43:53.437128-03');
INSERT INTO user_logins VALUES (176, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.111 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2015-02-17 16:26:20.202643-03', '2015-02-17 16:26:20.202643-03');
INSERT INTO user_logins VALUES (177, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.111 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2015-02-17 16:40:39.000475-03', '2015-02-17 16:40:39.000475-03');
INSERT INTO user_logins VALUES (178, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.111 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2015-02-17 16:42:31.308049-03', '2015-02-17 16:42:31.308049-03');
INSERT INTO user_logins VALUES (179, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.111 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2015-02-17 16:53:49.441132-03', '2015-02-17 16:53:49.441132-03');
INSERT INTO user_logins VALUES (180, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.111 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2015-02-17 17:13:52.816178-03', '2015-02-17 17:13:52.816178-03');
INSERT INTO user_logins VALUES (181, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.111 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2015-02-17 17:35:18.389741-03', '2015-02-17 17:35:18.389741-03');
INSERT INTO user_logins VALUES (182, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.111 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2015-02-17 17:37:33.281717-03', '2015-02-17 17:37:33.281717-03');
INSERT INTO user_logins VALUES (183, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.111 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2015-02-17 17:40:30.398448-03', '2015-02-17 17:40:30.398448-03');
INSERT INTO user_logins VALUES (184, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.111 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2015-02-21 19:27:57.294506-03', '2015-02-21 19:27:57.294506-03');
INSERT INTO user_logins VALUES (185, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.111 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2015-02-21 20:50:13.192502-03', '2015-02-21 20:50:13.192502-03');
INSERT INTO user_logins VALUES (186, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:34.0) Gecko/20100101 Firefox/34.0', 'List(Lang(en,US), Lang(en,))', 0, '2015-02-25 11:45:59.706195-03', '2015-02-25 11:45:59.706195-03');
INSERT INTO user_logins VALUES (187, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.115 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2015-03-03 00:38:47.090171-03', '2015-03-03 00:38:47.090171-03');
INSERT INTO user_logins VALUES (188, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.115 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2015-03-03 00:57:15.143489-03', '2015-03-03 00:57:15.143489-03');
INSERT INTO user_logins VALUES (189, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.115 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2015-03-03 01:21:28.012204-03', '2015-03-03 01:21:28.012204-03');
INSERT INTO user_logins VALUES (190, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.115 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2015-03-03 01:34:56.865006-03', '2015-03-03 01:34:56.865006-03');
INSERT INTO user_logins VALUES (191, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.115 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2015-03-03 01:47:38.744049-03', '2015-03-03 01:47:38.744049-03');
INSERT INTO user_logins VALUES (192, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.115 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2015-03-03 02:26:55.620553-03', '2015-03-03 02:26:55.620553-03');
INSERT INTO user_logins VALUES (193, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.115 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2015-03-03 02:27:13.373306-03', '2015-03-03 02:27:13.373306-03');
INSERT INTO user_logins VALUES (194, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:35.0) Gecko/20100101 Firefox/35.0', 'List(Lang(en,US), Lang(en,))', 0, '2015-03-03 02:49:55.280097-03', '2015-03-03 02:49:55.280097-03');
INSERT INTO user_logins VALUES (195, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.115 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2015-03-03 03:48:07.135012-03', '2015-03-03 03:48:07.135012-03');
INSERT INTO user_logins VALUES (196, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.115 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2015-03-03 03:48:16.568437-03', '2015-03-03 03:48:16.568437-03');
INSERT INTO user_logins VALUES (197, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.115 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2015-03-03 11:33:50.125935-03', '2015-03-03 11:33:50.125935-03');
INSERT INTO user_logins VALUES (198, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.115 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2015-03-03 12:31:56.378615-03', '2015-03-03 12:31:56.378615-03');
INSERT INTO user_logins VALUES (199, 'javier@crowsoft.com.ar', 'SUCCESS', 'iPad', '127.0.0.1', 'Mozilla/5.0 (iPad; CPU OS 7_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2015-03-03 15:01:04.669328-03', '2015-03-03 15:01:04.669328-03');
INSERT INTO user_logins VALUES (200, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.115 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2015-03-03 15:25:55.404352-03', '2015-03-03 15:25:55.404352-03');
INSERT INTO user_logins VALUES (201, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.115 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2015-03-03 23:34:02.33057-03', '2015-03-03 23:34:02.33057-03');
INSERT INTO user_logins VALUES (202, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.115 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2015-03-03 23:37:21.329041-03', '2015-03-03 23:37:21.329041-03');
INSERT INTO user_logins VALUES (203, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.115 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2015-03-04 00:07:41.427524-03', '2015-03-04 00:07:41.427524-03');
INSERT INTO user_logins VALUES (204, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.115 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2015-03-04 17:25:00.749753-03', '2015-03-04 17:25:00.749753-03');
INSERT INTO user_logins VALUES (205, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:35.0) Gecko/20100101 Firefox/35.0', 'List(Lang(en,US), Lang(en,))', 0, '2015-03-11 21:46:39.018215-03', '2015-03-11 21:46:39.018215-03');
INSERT INTO user_logins VALUES (206, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.115 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2015-03-15 16:27:53.288152-03', '2015-03-15 16:27:53.288152-03');
INSERT INTO user_logins VALUES (207, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.115 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2015-03-17 12:43:20.445846-03', '2015-03-17 12:43:20.445846-03');
INSERT INTO user_logins VALUES (208, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/600.1.17 (KHTML, like Gecko) Version/7.1 Safari/537.85.10', 'List(Lang(en,us))', 0, '2015-04-15 11:50:41.419711-03', '2015-04-15 11:50:41.419711-03');
INSERT INTO user_logins VALUES (209, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/600.1.17 (KHTML, like Gecko) Version/7.1 Safari/537.85.10', 'List(Lang(en,us))', 0, '2015-04-15 14:11:01.712045-03', '2015-04-15 14:11:01.712045-03');
INSERT INTO user_logins VALUES (210, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.90 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2015-04-30 11:57:26.36455-03', '2015-04-30 11:57:26.36455-03');
INSERT INTO user_logins VALUES (211, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2015-05-06 15:43:18.021178-03', '2015-05-06 15:43:18.021178-03');
INSERT INTO user_logins VALUES (212, 'javier@crowsoft.com.ar', 'BAD_PASSWORD', 'Android', '192.168.1.113', 'Mozilla/5.0 (Linux; Android 4.4.2; es-us; SAMSUNG GT-I9190 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Version/1.5 Chrome/28.0.1500.94 Mobile Safari/537.36', 'List(Lang(es,US), Lang(es,), Lang(en,US), Lang(en,))', 1, '2015-05-11 15:47:06.948641-03', '2015-05-11 15:47:06.948641-03');
INSERT INTO user_logins VALUES (213, 'javier@crowsoft.com.ar', 'BAD_PASSWORD', 'Android', '192.168.1.113', 'Mozilla/5.0 (Linux; Android 4.4.2; es-us; SAMSUNG GT-I9190 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Version/1.5 Chrome/28.0.1500.94 Mobile Safari/537.36', 'List(Lang(es,US), Lang(es,), Lang(en,US), Lang(en,))', 1, '2015-05-11 15:47:29.510121-03', '2015-05-11 15:47:29.510121-03');
INSERT INTO user_logins VALUES (214, 'javier@crowsoft.com.ar', 'BAD_PASSWORD', 'Android', '192.168.1.113', 'Mozilla/5.0 (Linux; Android 4.4.2; es-us; SAMSUNG GT-I9190 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Version/1.5 Chrome/28.0.1500.94 Mobile Safari/537.36', 'List(Lang(es,US), Lang(es,), Lang(en,US), Lang(en,))', 1, '2015-05-11 15:48:03.514906-03', '2015-05-11 15:48:03.514906-03');
INSERT INTO user_logins VALUES (215, 'javier@crowsoft.com.ar', 'SUCCESS', 'Android', '192.168.1.113', 'Mozilla/5.0 (Linux; Android 4.4.2; es-us; SAMSUNG GT-I9190 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Version/1.5 Chrome/28.0.1500.94 Mobile Safari/537.36', 'List(Lang(es,US), Lang(es,), Lang(en,US), Lang(en,))', 1, '2015-05-11 15:49:14.088123-03', '2015-05-11 15:49:14.088123-03');
INSERT INTO user_logins VALUES (216, 'javier@crowsoft.com.ar', 'BAD_PASSWORD', 'Mac', '0:0:0:0:0:0:0:1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.134 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2015-07-18 07:35:33.153536-03', '2015-07-18 07:35:33.153536-03');
INSERT INTO user_logins VALUES (217, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '0:0:0:0:0:0:0:1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.134 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2015-07-18 07:35:49.628082-03', '2015-07-18 07:35:49.628082-03');
INSERT INTO user_logins VALUES (218, 'javier@crowsoft.com.ar', 'BAD_PASSWORD', 'Mac', '0:0:0:0:0:0:0:1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.85 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,), Lang(ja,))', 0, '2015-09-14 09:34:19.458821-03', '2015-09-14 09:34:19.458821-03');
INSERT INTO user_logins VALUES (219, 'walter@salmax.com.ar', 'SUCCESS', 'Mac', '0:0:0:0:0:0:0:1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.85 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,), Lang(ja,))', 0, '2015-09-14 09:39:34.664025-03', '2015-09-14 09:39:34.664025-03');
INSERT INTO user_logins VALUES (220, 'walter@salmax.com.ar', 'SUCCESS', 'Mac', '0:0:0:0:0:0:0:1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.85 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,), Lang(ja,))', 0, '2015-09-14 09:55:01.011951-03', '2015-09-14 09:55:01.011951-03');
INSERT INTO user_logins VALUES (221, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.85 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,), Lang(ja,))', 0, '2015-09-14 13:20:48.892619-03', '2015-09-14 13:20:48.892619-03');
INSERT INTO user_logins VALUES (222, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '0:0:0:0:0:0:0:1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.85 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,), Lang(ja,))', 0, '2015-09-14 13:21:21.879669-03', '2015-09-14 13:21:21.879669-03');
INSERT INTO user_logins VALUES (223, 'walter@salmax.com.ar', 'SUCCESS', 'Mac', '0:0:0:0:0:0:0:1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.85 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,), Lang(ja,))', 0, '2015-09-14 15:26:03.425756-03', '2015-09-14 15:26:03.425756-03');
INSERT INTO user_logins VALUES (224, 'javier@crowsoft.com.ar', 'BAD_PASSWORD', 'Mac', '0:0:0:0:0:0:0:1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.85 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,), Lang(ja,))', 0, '2015-09-14 15:29:12.908372-03', '2015-09-14 15:29:12.908372-03');
INSERT INTO user_logins VALUES (225, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '0:0:0:0:0:0:0:1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.85 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,), Lang(ja,))', 0, '2015-09-14 15:31:13.893317-03', '2015-09-14 15:31:13.893317-03');
INSERT INTO user_logins VALUES (226, 'javier@crowsoft.com.ar', 'BAD_PASSWORD', 'Mac', '0:0:0:0:0:0:0:1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.85 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,), Lang(ja,))', 0, '2015-09-14 15:31:23.717547-03', '2015-09-14 15:31:23.717547-03');
INSERT INTO user_logins VALUES (227, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '0:0:0:0:0:0:0:1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.85 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,), Lang(ja,))', 0, '2015-09-14 15:31:34.940802-03', '2015-09-14 15:31:34.940802-03');
INSERT INTO user_logins VALUES (228, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '0:0:0:0:0:0:0:1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.85 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,), Lang(ja,))', 0, '2015-09-14 15:32:45.921951-03', '2015-09-14 15:32:45.921951-03');
INSERT INTO user_logins VALUES (229, 'walter@salmax.com.ar', 'SUCCESS', 'Mac', '0:0:0:0:0:0:0:1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.85 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,), Lang(ja,))', 0, '2015-09-14 15:33:25.851912-03', '2015-09-14 15:33:25.851912-03');
INSERT INTO user_logins VALUES (230, 'walter@salmax.com.ar', 'SUCCESS', 'Mac', '0:0:0:0:0:0:0:1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.85 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,), Lang(ja,))', 0, '2015-09-14 15:33:29.242985-03', '2015-09-14 15:33:29.242985-03');
INSERT INTO user_logins VALUES (231, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '0:0:0:0:0:0:0:1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.85 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,), Lang(ja,))', 0, '2015-09-14 15:33:45.248683-03', '2015-09-14 15:33:45.248683-03');
INSERT INTO user_logins VALUES (232, 'walter@salmax.com.ar', 'BAD_PASSWORD', 'Mac', '0:0:0:0:0:0:0:1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,), Lang(ja,), Lang(gl,), Lang(pt,))', 0, '2015-10-12 12:37:01.022873-03', '2015-10-12 12:37:01.022873-03');
INSERT INTO user_logins VALUES (233, 'javier@crowsoft.com.ar', 'BAD_PASSWORD', 'Mac', '0:0:0:0:0:0:0:1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,), Lang(ja,), Lang(gl,), Lang(pt,))', 0, '2015-10-12 12:39:03.292838-03', '2015-10-12 12:39:03.292838-03');
INSERT INTO user_logins VALUES (234, 'javier@crowsoft.com.ar', 'BAD_PASSWORD', 'Mac', '0:0:0:0:0:0:0:1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,), Lang(ja,), Lang(gl,), Lang(pt,))', 0, '2015-10-12 12:39:24.606633-03', '2015-10-12 12:39:24.606633-03');
INSERT INTO user_logins VALUES (235, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,), Lang(ja,), Lang(gl,), Lang(pt,))', 0, '2015-10-12 12:40:09.815245-03', '2015-10-12 12:40:09.815245-03');
INSERT INTO user_logins VALUES (236, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,), Lang(ja,), Lang(gl,), Lang(pt,))', 0, '2015-10-12 12:40:31.069294-03', '2015-10-12 12:40:31.069294-03');
INSERT INTO user_logins VALUES (237, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,), Lang(ja,), Lang(gl,), Lang(pt,))', 0, '2015-10-12 12:40:54.315523-03', '2015-10-12 12:40:54.315523-03');
INSERT INTO user_logins VALUES (238, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,), Lang(ja,), Lang(gl,), Lang(pt,))', 0, '2015-10-12 13:01:43.013577-03', '2015-10-12 13:01:43.013577-03');
INSERT INTO user_logins VALUES (239, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,), Lang(ja,), Lang(gl,), Lang(pt,))', 0, '2015-10-12 14:39:12.781383-03', '2015-10-12 14:39:12.781383-03');
INSERT INTO user_logins VALUES (240, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,), Lang(ja,), Lang(gl,), Lang(pt,))', 0, '2015-10-12 14:54:19.530919-03', '2015-10-12 14:54:19.530919-03');
INSERT INTO user_logins VALUES (241, 'javier@crowsoft.com.ar', 'BAD_PASSWORD', 'Mac', '0:0:0:0:0:0:0:1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.71 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,), Lang(ja,), Lang(gl,), Lang(pt,))', 0, '2015-10-16 21:44:01.796417-03', '2015-10-16 21:44:01.796417-03');
INSERT INTO user_logins VALUES (242, 'javier@crowsoft.com.ar', 'BAD_PASSWORD', 'Mac', '0:0:0:0:0:0:0:1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.71 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,), Lang(ja,), Lang(gl,), Lang(pt,))', 0, '2015-10-16 21:44:07.564942-03', '2015-10-16 21:44:07.564942-03');
INSERT INTO user_logins VALUES (243, 'javier@crowsoft.com.ar', 'BAD_PASSWORD', 'Mac', '0:0:0:0:0:0:0:1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.71 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,), Lang(ja,), Lang(gl,), Lang(pt,))', 0, '2015-10-16 21:44:19.186861-03', '2015-10-16 21:44:19.186861-03');
INSERT INTO user_logins VALUES (244, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '0:0:0:0:0:0:0:1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.71 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,), Lang(ja,), Lang(gl,), Lang(pt,))', 0, '2015-10-16 21:44:32.072012-03', '2015-10-16 21:44:32.072012-03');
INSERT INTO user_logins VALUES (245, 'walter@salmax.com.ar', 'BAD_PASSWORD', 'Mac', '0:0:0:0:0:0:0:1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.80 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,), Lang(ja,), Lang(gl,), Lang(pt,))', 0, '2015-12-10 16:11:07.124942-03', '2015-12-10 16:11:07.124942-03');
INSERT INTO user_logins VALUES (246, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '0:0:0:0:0:0:0:1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.80 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,), Lang(ja,), Lang(gl,), Lang(pt,))', 0, '2015-12-10 16:11:18.887276-03', '2015-12-10 16:11:18.887276-03');
INSERT INTO user_logins VALUES (247, 'javier@crowsoft.com.ar', 'BAD_PASSWORD', 'Mac', '0:0:0:0:0:0:0:1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) code/1.0.0 Chrome/47.0.2526.73 Electron/0.36.3 Safari/537.36', 'List(Lang(en,US))', 0, '2016-01-09 09:59:39.543885-03', '2016-01-09 09:59:39.543885-03');
INSERT INTO user_logins VALUES (248, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '0:0:0:0:0:0:0:1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) code/1.0.0 Chrome/47.0.2526.73 Electron/0.36.3 Safari/537.36', 'List(Lang(en,US))', 0, '2016-01-09 10:00:43.373664-03', '2016-01-09 10:00:43.373664-03');
INSERT INTO user_logins VALUES (249, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '0:0:0:0:0:0:0:1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) code/1.0.0 Chrome/47.0.2526.73 Electron/0.36.3 Safari/537.36', 'List(Lang(en,US))', 0, '2016-01-09 10:04:15.486727-03', '2016-01-09 10:04:15.486727-03');
INSERT INTO user_logins VALUES (250, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '0:0:0:0:0:0:0:1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) code/1.0.0 Chrome/47.0.2526.73 Electron/0.36.3 Safari/537.36', 'List(Lang(en,US))', 0, '2016-01-09 10:05:11.603452-03', '2016-01-09 10:05:11.603452-03');
INSERT INTO user_logins VALUES (251, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '0:0:0:0:0:0:0:1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) code/1.0.0 Chrome/47.0.2526.73 Electron/0.36.3 Safari/537.36', 'List(Lang(en,US))', 0, '2016-01-09 10:58:34.675571-03', '2016-01-09 10:58:34.675571-03');
INSERT INTO user_logins VALUES (252, 'javier@crowsoft.com.ar', 'SUCCESS', 'Windows', '192.168.0.4', 'Mozilla/5.0 (Windows NT 6.0; rv:12.0) Gecko/20100101 Firefox/12.0', 'List(Lang(en,us), Lang(en,))', 0, '2016-01-10 23:27:21.52831-03', '2016-01-10 23:27:21.52831-03');
INSERT INTO user_logins VALUES (253, 'javier@crowsoft.com.ar', 'SUCCESS', 'Windows', '192.168.0.4', 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.0; Trident/5.0; BOIE9;ENUS)', 'List(Lang(en,us))', 0, '2016-01-10 23:41:47.926089-03', '2016-01-10 23:41:47.926089-03');
INSERT INTO user_logins VALUES (254, 'javier@crowsoft.com.ar', 'SUCCESS', 'Windows', '192.168.0.4', 'Mozilla/5.0 (Windows NT 6.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36', 'List(Lang(en,US), Lang(en,))', 0, '2016-01-10 23:44:46.710059-03', '2016-01-10 23:44:46.710059-03');
INSERT INTO user_logins VALUES (255, 'javier@crowsoft.com.ar', 'SUCCESS', 'Windows', '192.168.0.4', 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.0; Trident/5.0; BOIE9;ENUS)', 'List(Lang(en,us))', 0, '2016-01-11 00:13:35.684707-03', '2016-01-11 00:13:35.684707-03');
INSERT INTO user_logins VALUES (256, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '0:0:0:0:0:0:0:1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:42.0) Gecko/20100101 Firefox/42.0', 'List(Lang(en,US), Lang(en,))', 0, '2016-01-11 00:14:46.751012-03', '2016-01-11 00:14:46.751012-03');
INSERT INTO user_logins VALUES (257, 'javier@crowsoft.com.ar', 'BAD_PASSWORD', 'Mac', '0:0:0:0:0:0:0:1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.116 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,), Lang(ja,), Lang(gl,), Lang(pt,))', 0, '2016-02-27 23:03:40.519997-03', '2016-02-27 23:03:40.519997-03');
INSERT INTO user_logins VALUES (258, 'javier@crowsoft.com.ar', 'SUCCESS', 'Mac', '0:0:0:0:0:0:0:1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.116 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,), Lang(ja,), Lang(gl,), Lang(pt,))', 0, '2016-02-27 23:03:45.936657-03', '2016-02-27 23:03:45.936657-03');


--
-- TOC entry 1839 (class 0 OID 64075)
-- Dependencies: 143
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO users VALUES (8, 'javier22@crowsoft.com.ar', 'javier22@crowsoft.com.ar', '1000:128f97941610549f2fcce724e13bb7e5038c0546dea07621:37b75d1f2a61bb7a50da68fa1d059ba4164cf07b9862ab32', '196d57b8f67bbdf0e42a10fcd02d1a430c0edd2528a5b0aa', 0, 0, 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.131 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-05-14 17:04:26.510102-03', '2014-05-14 17:04:26.510102-03');
INSERT INTO users VALUES (9, 'javier234@crowsoft.com.ar', 'javier234@crowsoft.com.ar', '1000:462cf071491fdc2645839dcbbfd385083bd4927525a09cc4:657631d86b27f9455d865d07f86def7baa21f0608a96807a', 'd994942ec0435b09c9305d907add29670b99d590738c5879', 0, 0, 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.131 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-05-14 18:59:47.009917-03', '2014-05-14 18:59:47.009917-03');
INSERT INTO users VALUES (10, 'javier23344@crowsoft.com.ar', 'javier23344@crowsoft.com.ar', '1000:8e54e790ca6d7177b3ab1a68897a9e19026ba48814a42313:017694aeb21f9fcf6010d762c1f923651cf5153f2f1eff7f', '028c028fc6baca262c943e5e9e378f9c6cd7684fba821bae', 0, 0, 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.131 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-05-14 19:01:58.806641-03', '2014-05-14 19:01:58.806641-03');
INSERT INTO users VALUES (11, 'javier233222@crowsoft.com.ar', 'javier233222@crowsoft.com.ar', '1000:05d268564c384700b2168e67edc26b1e9efadf45f4031072:b4f0aba83e9b31556d1724027ded570be5e21c9a461c8fe5', 'bac1e5b4f514942ba1d5996070b1af909d2099d01437cd1b', 0, 0, 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.131 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-05-14 19:05:22.049054-03', '2014-05-14 19:05:22.049054-03');
INSERT INTO users VALUES (7, 'javier2@crowsoft.com.ar', 'javier2@crowsoft.com.ar', '1000:08fcd5c1df729d58df5655a562f3f756e06c00fa4913d6c8:62e4b388c6c075587e5514758eb4d5198e6214b46e0dbe76', '7c2c7c3fdf8da0bd1c9f2124af0df966f8bbb4b964f3e854', 1, 0, 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.131 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-05-14 12:55:30.589182-03', '2014-05-14 12:55:30.589182-03');
INSERT INTO users VALUES (78, 'walter@salmax.com.ar', 'walter@salmax.com.ar', '1000:049dc242cf6c9a04bdf71c0cb130884f36aceb2ae91b8d51:e10f30399f35f1d43ded8a88659ace48709787b188ee062a', '21e55e0118f1b39c74a9729ee0e4ab28be0cfa60a4bebccb', 1, 0, 'Mac', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36', 'List(Lang(en,US), Lang(en,), Lang(es,))', 0, '2014-05-17 11:43:55.037688-03', '2014-05-17 11:43:55.037688-03');
INSERT INTO users VALUES (1, 'javier@crowsoft.com.ar', 'javier@crowsoft.com.ar', '1000:ea791f79784557b3d3c17f44d26252605ec37971ce057c3a:c671a1ee2038c4d8efbc36a0601fcf8ca108967dbf8b9fb1', '21e55e0118f1b39c74a9729ee0e4ab28be0cfa60a4bebccb', 1, 0, 'Android', '127.0.0.1', 'Mozilla/5.0 (Linux; Android 4.2.1; en-us; Nexus 4 Build/JOP40D) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 Mobile Safari/535.19', 'List(Lang(en,US), Lang(en,), Lang(es,))', 1, '2014-05-10 11:40:39.403239-03', '2014-05-10 11:40:39.403239-03');


--
-- TOC entry 1834 (class 2606 OID 87065)
-- Dependencies: 147 147
-- Name: domains_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY domains
    ADD CONSTRAINT domains_pkey PRIMARY KEY (dm_id);


--
-- TOC entry 1836 (class 2606 OID 87067)
-- Dependencies: 147 147
-- Name: ix_domains_database; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY domains
    ADD CONSTRAINT ix_domains_database UNIQUE (dm_database);


--
-- TOC entry 1829 (class 2606 OID 64177)
-- Dependencies: 145 145
-- Name: ix_token_token; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY token
    ADD CONSTRAINT ix_token_token UNIQUE (tk_token);


--
-- TOC entry 1823 (class 2606 OID 64090)
-- Dependencies: 143 143
-- Name: ix_users_email; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY users
    ADD CONSTRAINT ix_users_email UNIQUE (us_email);


--
-- TOC entry 1825 (class 2606 OID 64092)
-- Dependencies: 143 143
-- Name: ix_users_username; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY users
    ADD CONSTRAINT ix_users_username UNIQUE (us_username);


--
-- TOC entry 1832 (class 2606 OID 64175)
-- Dependencies: 145 145
-- Name: token_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY token
    ADD CONSTRAINT token_pkey PRIMARY KEY (tk_id);


--
-- TOC entry 1838 (class 2606 OID 87205)
-- Dependencies: 149 149
-- Name: user_logins_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY user_logins
    ADD CONSTRAINT user_logins_pkey PRIMARY KEY (usl_id);


--
-- TOC entry 1827 (class 2606 OID 64088)
-- Dependencies: 143 143
-- Name: users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (us_id);


--
-- TOC entry 1830 (class 1259 OID 64178)
-- Dependencies: 145
-- Name: ix_token_type; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX ix_token_type ON token USING btree (tk_type);


--
-- TOC entry 1847 (class 0 OID 0)
-- Dependencies: 5
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2016-02-28 10:50:08 ART

--
-- PostgreSQL database dump complete
--

