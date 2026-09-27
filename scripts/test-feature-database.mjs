// Real PostgreSQL (PGlite) isolated replay. Auth/storage service schemas are
// minimal local fixtures; this does not certify hosted Supabase Auth or REST.
import {readFileSync,readdirSync,writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {PGlite} from '../.scratch/feature-db/node_modules/@electric-sql/pglite/dist/index.js';
const db=new PGlite();let passed=0;
const receipt={engine:'PGlite 0.5.8 / PostgreSQL',productionCertified:false,migrations:[],checks:[],status:'RUNNING'};
async function check(name,fn){await fn();passed++;receipt.checks.push(name);console.log('PASS',name);}
const a='30000000-0000-4000-8000-000000000001',b='30000000-0000-4000-8000-000000000002';
async function asUser(id){await db.exec(`RESET ROLE; SELECT set_config('request.jwt.claim.sub','${id}',false); SELECT set_config('request.jwt.claims','{"sub":"${id}","email":"member@example.test"}',false); SET ROLE authenticated;`);}
async function count(table){return Number((await db.query(`SELECT count(*) AS n FROM ${table}`)).rows[0].n);}
try{
 await db.exec(`CREATE ROLE anon NOLOGIN; CREATE ROLE authenticated NOLOGIN; CREATE ROLE service_role NOLOGIN BYPASSRLS;
 CREATE SCHEMA auth; CREATE SCHEMA storage;
 CREATE TABLE auth.users(id uuid PRIMARY KEY,instance_id uuid,aud text,role text,email text,encrypted_password text,confirmed_at timestamptz,raw_app_meta_data jsonb DEFAULT '{}',raw_user_meta_data jsonb DEFAULT '{}',created_at timestamptz DEFAULT now(),updated_at timestamptz DEFAULT now());
 CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$ SELECT NULLIF(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
 CREATE FUNCTION auth.jwt() RETURNS jsonb LANGUAGE sql STABLE AS $$ SELECT COALESCE(NULLIF(current_setting('request.jwt.claims',true),''),'{}')::jsonb $$;
 CREATE FUNCTION auth.role() RETURNS text LANGUAGE sql STABLE AS $$ SELECT current_user::text $$;
 GRANT USAGE ON SCHEMA auth TO anon,authenticated; GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA auth TO anon,authenticated;
 CREATE TABLE storage.buckets(id text PRIMARY KEY,public boolean DEFAULT false);CREATE TABLE storage.objects(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),bucket_id text,name text,owner uuid);ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
 ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon,authenticated,service_role;
 ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon,authenticated,service_role;`);
 for(const file of readdirSync('Finance4allLanding/supabase/migrations').filter(n=>n.endsWith('.sql')).sort()){
  try{await db.exec(readFileSync('Finance4allLanding/supabase/migrations/'+file,'utf8'));receipt.migrations.push(file);}catch(e){throw new Error(`Migration ${file}: ${e.message}`);}
 }
 await db.exec(`INSERT INTO auth.users(id,email) VALUES ('${a}','a@example.test'),('${b}','b@example.test');`);
 await asUser(a);
 await check('owner creates learning and draft records',async()=>{await db.exec("INSERT INTO member_learning(lesson_id,notes) VALUES ('lesson-one','private notes'); INSERT INTO application_drafts(call_id,motivation) VALUES ('quant-research','Private incomplete draft');");assert.equal(await count('member_learning'),1);assert.equal(await count('application_drafts'),1);});
 await check('concurrent stale learning update does not overwrite',async()=>{assert.equal((await db.query("UPDATE member_learning SET notes='new' WHERE lesson_id='lesson-one' AND revision=0 RETURNING revision")).rows[0].revision,1);assert.equal((await db.query("UPDATE member_learning SET notes='stale' WHERE lesson_id='lesson-one' AND revision=0 RETURNING revision")).rows.length,0);});
 await check('client cannot forge learning owner or revision',async()=>{await assert.rejects(db.exec(`UPDATE member_learning SET user_id='${b}'`),/permission denied/i);await assert.rejects(db.exec('UPDATE member_learning SET revision=999'),/permission denied/i);});
 await check('stale draft writes and deletes are rejected by revision matching',async()=>{await db.exec("UPDATE application_drafts SET motivation='second version' WHERE call_id='quant-research' AND revision=0");assert.equal((await db.query("UPDATE application_drafts SET motivation='lost update' WHERE revision=0 RETURNING call_id")).rows.length,0);assert.equal((await db.query('DELETE FROM application_drafts WHERE revision=0 RETURNING call_id')).rows.length,0);});
 await check('another member sees no private learning or drafts',async()=>{await asUser(b);assert.equal(await count('member_learning'),0);assert.equal(await count('application_drafts'),0);assert.equal((await db.query("UPDATE member_learning SET notes='intrusion' RETURNING lesson_id")).rows.length,0);assert.equal((await db.query('DELETE FROM application_drafts RETURNING call_id')).rows.length,0);});
 await check('anonymous access is denied',async()=>{await db.exec('RESET ROLE; SET ROLE anon;');for(const table of ['member_learning','application_drafts','intake_history'])await assert.rejects(db.exec(`SELECT * FROM ${table}`),/permission denied/i);});
 await asUser(a);
 const sid='40000000-0000-4000-8000-000000000001';
 await check('submission and withdrawal create immutable real history',async()=>{await db.exec(`INSERT INTO intake_submissions(id,call_id,motivation,preparation,availability,privacy_version,consent) VALUES ('${sid}','quant-research',repeat('research ',12),repeat('preparation ',5),'four hours UTC','2026-09-21',true);UPDATE intake_submissions SET status='withdrawn' WHERE id='${sid}';`);assert.deepEqual((await db.query('SELECT status FROM intake_history ORDER BY id')).rows.map(r=>r.status),['submitted','withdrawn']);await assert.rejects(db.exec("UPDATE intake_history SET note='rewrite'"),/permission denied/i);});
 await check('history is private to applicant and authorized reviewer',async()=>{await asUser(b);assert.equal(await count('intake_history'),0);await asUser(a);assert.equal(await count('intake_history'),2);});
 await check('account export includes private learning, drafts and history',async()=>{const exported=(await db.query('SELECT export_my_data() AS data')).rows[0].data;assert.equal(exported.member_learning.length,1);assert.equal(exported.application_drafts.length,1);assert.equal(exported.intake_history.length,2);});
 await check('account deletion cascades private records and history',async()=>{await db.exec(`RESET ROLE; DELETE FROM auth.users WHERE id='${a}';`);assert.equal(await count('member_learning'),0);assert.equal(await count('application_drafts'),0);assert.equal(await count('intake_history'),0);});
 for(const suite of ['two_identity_rls_certification.sql','intake_rls_certification.sql','collaboration_rls_certification.sql'])await check(suite,async()=>{await db.exec('RESET ROLE;');await db.exec(readFileSync('Finance4allLanding/supabase/tests/'+suite,'utf8'));});
 receipt.status='PASS';receipt.notRun=['account_lifecycle_rls_certification.sql: pgTAP extension unavailable in this local engine; required on standard PostgreSQL before deployment'];
}catch(e){receipt.status='FAIL';receipt.error=e.message;console.error(e.message);process.exitCode=1;}
finally{receipt.passed=passed;writeFileSync(process.env.DATABASE_RECEIPT ?? 'evidence/final-release-2026-09-25/database.json',JSON.stringify(receipt,null,2)+'\n');await db.close();}
