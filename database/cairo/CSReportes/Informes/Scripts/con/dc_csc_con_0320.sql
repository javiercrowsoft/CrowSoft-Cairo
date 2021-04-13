/*---------------------------------------------------------------------
Nombre: Libro Diario
---------------------------------------------------------------------*/
if exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[DC_CSC_CON_0320]') and OBJECTPROPERTY(id, N'IsProcedure') = 1)
drop procedure [dbo].[DC_CSC_CON_0320]
GO

/*

Para testear:

DC_CSC_CON_0320 1,
                '20060101',
                '20060120',
                '0',
                '0',
                '0',
                '0',
                '0'
*/

create procedure DC_CSC_CON_0320 (

  @@us_id        int,
  @@Fini          datetime,
  @@Ffin          datetime,
  @@cue_id      varchar(255),
  @@cico_id     varchar(255),
  @@doc_id       varchar(255),
  @@mon_id       varchar(255),
  @@emp_id       varchar(255),

  @@doct_id           varchar(255),
  @@bSoloGenericos    smallint,
  @@Fcreado     datetime,
  @@bResumido   tinyint

)as

begin
set nocount on
/*- ///////////////////////////////////////////////////////////////////////

INICIO PRIMERA PARTE DE ARBOLES

/////////////////////////////////////////////////////////////////////// */

declare @cue_id       int
declare @mon_id       int
declare @emp_id       int
declare @cico_id       int
declare @doc_id        int
declare @doct_id      int

declare @ram_id_cuenta           int
declare @ram_id_moneda           int
declare @ram_id_empresa          int
declare @ram_id_circuitocontable int
declare @ram_id_documento        int
declare @ram_id_documentoTipo     int

declare @clienteID       int
declare @clienteIDccosi int

declare @IsRaiz    tinyint

exec sp_ArbConvertId @@mon_id,       @mon_id  out,        @ram_id_moneda out
exec sp_ArbConvertId @@emp_id,       @emp_id  out,        @ram_id_empresa out
exec sp_ArbConvertId @@cue_id,       @cue_id  out,         @ram_id_cuenta out
exec sp_ArbConvertId @@cico_id,      @cico_id out,         @ram_id_circuitocontable out
exec sp_ArbConvertId @@doc_id,        @doc_id  out,         @ram_id_Documento out
exec sp_ArbConvertId @@doct_id,      @doct_id out,         @ram_id_DocumentoTipo out

exec sp_GetRptId @clienteID out
exec sp_GetRptId @clienteIDccosi out

if @ram_id_cuenta <> 0 begin

--  exec sp_ArbGetGroups @ram_id_cuenta, @clienteID, @@us_id

  exec sp_ArbIsRaiz @ram_id_cuenta, @IsRaiz out
  if @IsRaiz = 0 begin
    exec sp_ArbGetAllHojas @ram_id_cuenta, @clienteID
  end else
    set @ram_id_cuenta = 0
end

if @ram_id_moneda <> 0 begin

--  exec sp_ArbGetGroups @ram_id_moneda, @clienteID, @@us_id

  exec sp_ArbIsRaiz @ram_id_moneda, @IsRaiz out
  if @IsRaiz = 0 begin
    exec sp_ArbGetAllHojas @ram_id_moneda, @clienteID
  end else
    set @ram_id_moneda = 0
end

if @ram_id_empresa <> 0 begin

--  exec sp_ArbGetGroups @ram_id_empresa, @clienteID, @@us_id

  exec sp_ArbIsRaiz @ram_id_empresa, @IsRaiz out
  if @IsRaiz = 0 begin
    exec sp_ArbGetAllHojas @ram_id_empresa, @clienteID
  end else
    set @ram_id_empresa = 0
end

if @ram_id_circuitocontable <> 0 begin

--  exec sp_ArbGetGroups @ram_id_circuitocontable, @clienteID, @@us_id

  exec sp_ArbIsRaiz @ram_id_circuitocontable, @IsRaiz out
  if @IsRaiz = 0 begin
    exec sp_ArbGetAllHojas @ram_id_circuitocontable, @clienteID
  end else
    set @ram_id_circuitocontable = 0
end

if @ram_id_documento <> 0 begin

--  exec sp_ArbGetGroups @ram_id_documento, @clienteID, @@us_id

  exec sp_ArbIsRaiz @ram_id_documento, @IsRaiz out
  if @IsRaiz = 0 begin
    exec sp_ArbGetAllHojas @ram_id_documento, @clienteID
  end else
    set @ram_id_documento = 0
end

if @ram_id_documentoTipo <> 0 begin

--  exec sp_ArbGetGroups @ram_id_documentoTipo, @clienteID, @@us_id

  exec sp_ArbIsRaiz @ram_id_documentoTipo, @IsRaiz out
  if @IsRaiz = 0 begin
    exec sp_ArbGetAllHojas @ram_id_documentoTipo, @clienteID
  end else
    set @ram_id_documentoTipo = 0
end

/*- ///////////////////////////////////////////////////////////////////////

FIN PRIMERA PARTE DE ARBOLES

/////////////////////////////////////////////////////////////////////// */

select
      ast.as_id             as comp_id,
      as_numero             as [N�mero],
      as_nrodoc              as [Comprobante],
      doc_nombre            as [Documento],
      as_fecha              as [Fecha],

      convert(varchar(7),as_fecha,102) as [Mes],



--       case doct_id_cliente
--
--         when 1  then           'Factura de Venta'
--         when 2  then           'Factura de Compra'
--         when 7  then           'Nota de Credito Venta'
--         when 8  then           'Nota de Credito Compra'
--         when 9  then           'Nota de Debito Venta'
--         when 10  then          'Nota de Debito Compra'
--         when 13  then          'Cobranza'
--         when 16  then          'Orden de Pago'
--         when 17  then          'Deposito Banco'
--         when 26  then          'Movimiento de Fondos'
--
--      end

      (select doct_codigo from DocumentoTipo where doct_id = ast.doct_id_cliente)
                            as [C�digo Doc.],

      (select doct_nombre from DocumentoTipo where doct_id = ast.doct_id_cliente)
                            as [Tipo Doc.],

      as_doc_cliente        as [Documento Aux],
      emp_nombre            as [Empresa],

      ast.Creado,
      ast.Modificado,
      us_nombre             as [Modifico],


      cue_nombre             as Cuenta,
      asi_debe               as Debe,
      asi_haber              as Haber,

      as_descrip            as [Observaciones]

from

      asiento ast

              inner join documento   doc  on ast.doc_id   = doc.doc_id
              inner join usuario     us   on ast.modifico = us.us_id
              inner join empresa     emp  on doc.emp_id   = emp.emp_id
              inner join asientoItem asi  on ast.as_id    = asi.as_id
              inner join cuenta      cue  on asi.cue_id   = cue.cue_id

where
          as_fecha >= @@Fini
      and  as_fecha <= @@Ffin

      and (doct_id_cliente is null or @@bSoloGenericos = 0)
      and (ast.creado >= @@fCreado)

-- Validar usuario - empresa
      and (
            exists(select * from EmpresaUsuario where emp_id = doc.emp_id and us_id = @@us_id) or (@@us_id = 1)
          )

/* -///////////////////////////////////////////////////////////////////////

INICIO SEGUNDA PARTE DE ARBOLES

/////////////////////////////////////////////////////////////////////// */

and   (  @cue_id = 0
       or
         exists(select as_id from AsientoItem asi2
                where as_id = ast.as_id
                  and asi2.cue_id = @cue_id
                )
      )


and   (  @mon_id = 0
       or
         exists(select as_id from AsientoItem asi2
                where as_id = ast.as_id
                  and asi2.mon_id = @mon_id
                )
      )

and   (doc.emp_id   = @emp_id   or @emp_id  =0)
and   (doc.cico_id   = @cico_id   or @cico_id  =0)
and   (ast.doc_id   = @doc_id   or @doc_id  =0)
and   (      ast.doct_id         = @doct_id
        or  ast.doct_id_cliente  = @doct_id
        or   @doct_id  =0
      )

-- Arboles

and   (
          (exists(select as_id from AsientoItem
                  where as_id = ast.as_id
                    and (
                          exists(select rptarb_hojaid
                                 from rptArbolRamaHoja
                                 where rptarb_cliente = @clienteID
                                   and tbl_id = 17
                                   and rptarb_hojaid = cue_id
                                 )
                        )
                  )
           )
        or
           (@ram_id_cuenta = 0)
       )

and   (
          (exists(select as_id from AsientoItem
                  where as_id = as_id
                    and (
                          exists(select rptarb_hojaid
                                 from rptArbolRamaHoja
                                 where rptarb_cliente = @clienteID
                                   and tbl_id = 12
                                   and rptarb_hojaid = mon_id
                                 )
                        )
                  )
           )
        or
           (@ram_id_moneda = 0)
       )

and   (
          (exists(select rptarb_hojaid
                  from rptArbolRamaHoja
                  where
                       rptarb_cliente = @clienteID
                  and  tbl_id = 1018
                  and  rptarb_hojaid = doc.emp_id
                 )
           )
        or
           (@ram_id_empresa = 0)
       )
and   (
          (exists(select rptarb_hojaid
                  from rptArbolRamaHoja
                  where
                       rptarb_cliente = @clienteID
                  and  tbl_id = 1016
                  and  rptarb_hojaid = doc.cico_id
                 )
           )
        or
           (@ram_id_circuitocontable = 0)
       )

and   (
          (exists(select rptarb_hojaid
                  from rptArbolRamaHoja
                  where
                       rptarb_cliente = @clienteID
                  and  tbl_id = 4001
                  and  rptarb_hojaid = ast.doc_id
                 )
           )
        or
           (@ram_id_documento = 0)
       )

and   (
          (exists(select rptarb_hojaid
                  from rptArbolRamaHoja
                  where
                       rptarb_cliente = @clienteID
                  and  tbl_id = 4003
                  and  (    rptarb_hojaid = ast.doct_id
                        or  rptarb_hojaid = ast.doct_id_cliente
                        )
                 )
           )
        or
           (@ram_id_documentoTipo = 0)
       )

order by Cuenta, Fecha, Comprobante, Debe desc

end
GO