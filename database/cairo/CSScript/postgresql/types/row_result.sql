CREATE TYPE row_result AS (
    type    varchar,
    id      integer,
    message varchar,
    r       refcursor
);
