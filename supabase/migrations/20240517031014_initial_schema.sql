create sequence "public"."Models_id_seq";

create table "public"."Chats" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp(6) with time zone not null default CURRENT_TIMESTAMP,
    "name" text not null,
    "thread_id" text,
    "model_id" integer not null default 1,
    "project_id" uuid not null,
    "exclude_prior_messages" boolean not null default false
);


create table "public"."GroqKeys" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp(6) with time zone not null default CURRENT_TIMESTAMP,
    "key" text not null,
    "iv" bytea not null,
    "user_id" text not null
);


create table "public"."Messages" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp(6) with time zone not null default CURRENT_TIMESTAMP,
    "type" text not null,
    "content" text not null,
    "chat_id" uuid not null
);


create table "public"."Models" (
    "id" integer not null default nextval('"Models_id_seq"'::regclass),
    "created_at" timestamp(6) with time zone not null default CURRENT_TIMESTAMP,
    "name" text not null,
    "display_name" text,
    "context_window" integer not null
);


create table "public"."OpenAIKeys" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp(6) with time zone not null default CURRENT_TIMESTAMP,
    "key" text not null,
    "iv" bytea not null,
    "user_id" text not null
);


create table "public"."Projects" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp(6) with time zone not null default CURRENT_TIMESTAMP,
    "name" text not null,
    "programming_languages" text,
    "packages" text,
    "context" text,
    "system_prompt" text not null default ''::text,
    "user_id" text not null
);


create table "public"."Prompts" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp(6) with time zone not null default CURRENT_TIMESTAMP,
    "content" text not null,
    "user_id" text not null
);


create table "public"."Users" (
    "id" text not null,
    "created_at" timestamp(6) with time zone not null default CURRENT_TIMESTAMP,
    "groq_key_info" uuid,
    "openai_key_info" uuid
);


alter sequence "public"."Models_id_seq" owned by "public"."Models"."id";

CREATE UNIQUE INDEX "Chats_pkey" ON public."Chats" USING btree (id);

CREATE UNIQUE INDEX "GroqKeys_pkey" ON public."GroqKeys" USING btree (id);

CREATE UNIQUE INDEX "Messages_pkey" ON public."Messages" USING btree (id);

CREATE UNIQUE INDEX "Models_pkey" ON public."Models" USING btree (id);

CREATE UNIQUE INDEX "OpenAIKeys_pkey" ON public."OpenAIKeys" USING btree (id);

CREATE UNIQUE INDEX "Projects_pkey" ON public."Projects" USING btree (id);

CREATE UNIQUE INDEX "Prompts_pkey" ON public."Prompts" USING btree (id);

CREATE UNIQUE INDEX "Users_groq_key_info_key" ON public."Users" USING btree (groq_key_info);

CREATE UNIQUE INDEX "Users_openai_key_info_key" ON public."Users" USING btree (openai_key_info);

CREATE UNIQUE INDEX "Users_pkey" ON public."Users" USING btree (id);

alter table "public"."Chats" add constraint "Chats_pkey" PRIMARY KEY using index "Chats_pkey";

alter table "public"."GroqKeys" add constraint "GroqKeys_pkey" PRIMARY KEY using index "GroqKeys_pkey";

alter table "public"."Messages" add constraint "Messages_pkey" PRIMARY KEY using index "Messages_pkey";

alter table "public"."Models" add constraint "Models_pkey" PRIMARY KEY using index "Models_pkey";

alter table "public"."OpenAIKeys" add constraint "OpenAIKeys_pkey" PRIMARY KEY using index "OpenAIKeys_pkey";

alter table "public"."Projects" add constraint "Projects_pkey" PRIMARY KEY using index "Projects_pkey";

alter table "public"."Prompts" add constraint "Prompts_pkey" PRIMARY KEY using index "Prompts_pkey";

alter table "public"."Users" add constraint "Users_pkey" PRIMARY KEY using index "Users_pkey";

alter table "public"."Chats" add constraint "Chats_model_id_fkey" FOREIGN KEY (model_id) REFERENCES "Models"(id) not valid;

alter table "public"."Chats" validate constraint "Chats_model_id_fkey";

alter table "public"."Chats" add constraint "Chats_project_id_fkey" FOREIGN KEY (project_id) REFERENCES "Projects"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."Chats" validate constraint "Chats_project_id_fkey";

alter table "public"."Messages" add constraint "Messages_chat_id_fkey" FOREIGN KEY (chat_id) REFERENCES "Chats"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."Messages" validate constraint "Messages_chat_id_fkey";

alter table "public"."Projects" add constraint "Projects_user_id_fkey" FOREIGN KEY (user_id) REFERENCES "Users"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."Projects" validate constraint "Projects_user_id_fkey";

alter table "public"."Prompts" add constraint "Prompts_user_id_fkey" FOREIGN KEY (user_id) REFERENCES "Users"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."Prompts" validate constraint "Prompts_user_id_fkey";

alter table "public"."Users" add constraint "Users_groq_key_info_fkey" FOREIGN KEY (groq_key_info) REFERENCES "GroqKeys"(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."Users" validate constraint "Users_groq_key_info_fkey";

alter table "public"."Users" add constraint "Users_openai_key_info_fkey" FOREIGN KEY (openai_key_info) REFERENCES "OpenAIKeys"(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."Users" validate constraint "Users_openai_key_info_fkey";

grant delete on table "public"."Chats" to "anon";

grant insert on table "public"."Chats" to "anon";

grant references on table "public"."Chats" to "anon";

grant select on table "public"."Chats" to "anon";

grant trigger on table "public"."Chats" to "anon";

grant truncate on table "public"."Chats" to "anon";

grant update on table "public"."Chats" to "anon";

grant delete on table "public"."Chats" to "authenticated";

grant insert on table "public"."Chats" to "authenticated";

grant references on table "public"."Chats" to "authenticated";

grant select on table "public"."Chats" to "authenticated";

grant trigger on table "public"."Chats" to "authenticated";

grant truncate on table "public"."Chats" to "authenticated";

grant update on table "public"."Chats" to "authenticated";

grant delete on table "public"."Chats" to "service_role";

grant insert on table "public"."Chats" to "service_role";

grant references on table "public"."Chats" to "service_role";

grant select on table "public"."Chats" to "service_role";

grant trigger on table "public"."Chats" to "service_role";

grant truncate on table "public"."Chats" to "service_role";

grant update on table "public"."Chats" to "service_role";

grant delete on table "public"."GroqKeys" to "anon";

grant insert on table "public"."GroqKeys" to "anon";

grant references on table "public"."GroqKeys" to "anon";

grant select on table "public"."GroqKeys" to "anon";

grant trigger on table "public"."GroqKeys" to "anon";

grant truncate on table "public"."GroqKeys" to "anon";

grant update on table "public"."GroqKeys" to "anon";

grant delete on table "public"."GroqKeys" to "authenticated";

grant insert on table "public"."GroqKeys" to "authenticated";

grant references on table "public"."GroqKeys" to "authenticated";

grant select on table "public"."GroqKeys" to "authenticated";

grant trigger on table "public"."GroqKeys" to "authenticated";

grant truncate on table "public"."GroqKeys" to "authenticated";

grant update on table "public"."GroqKeys" to "authenticated";

grant delete on table "public"."GroqKeys" to "service_role";

grant insert on table "public"."GroqKeys" to "service_role";

grant references on table "public"."GroqKeys" to "service_role";

grant select on table "public"."GroqKeys" to "service_role";

grant trigger on table "public"."GroqKeys" to "service_role";

grant truncate on table "public"."GroqKeys" to "service_role";

grant update on table "public"."GroqKeys" to "service_role";

grant delete on table "public"."Messages" to "anon";

grant insert on table "public"."Messages" to "anon";

grant references on table "public"."Messages" to "anon";

grant select on table "public"."Messages" to "anon";

grant trigger on table "public"."Messages" to "anon";

grant truncate on table "public"."Messages" to "anon";

grant update on table "public"."Messages" to "anon";

grant delete on table "public"."Messages" to "authenticated";

grant insert on table "public"."Messages" to "authenticated";

grant references on table "public"."Messages" to "authenticated";

grant select on table "public"."Messages" to "authenticated";

grant trigger on table "public"."Messages" to "authenticated";

grant truncate on table "public"."Messages" to "authenticated";

grant update on table "public"."Messages" to "authenticated";

grant delete on table "public"."Messages" to "service_role";

grant insert on table "public"."Messages" to "service_role";

grant references on table "public"."Messages" to "service_role";

grant select on table "public"."Messages" to "service_role";

grant trigger on table "public"."Messages" to "service_role";

grant truncate on table "public"."Messages" to "service_role";

grant update on table "public"."Messages" to "service_role";

grant delete on table "public"."Models" to "anon";

grant insert on table "public"."Models" to "anon";

grant references on table "public"."Models" to "anon";

grant select on table "public"."Models" to "anon";

grant trigger on table "public"."Models" to "anon";

grant truncate on table "public"."Models" to "anon";

grant update on table "public"."Models" to "anon";

grant delete on table "public"."Models" to "authenticated";

grant insert on table "public"."Models" to "authenticated";

grant references on table "public"."Models" to "authenticated";

grant select on table "public"."Models" to "authenticated";

grant trigger on table "public"."Models" to "authenticated";

grant truncate on table "public"."Models" to "authenticated";

grant update on table "public"."Models" to "authenticated";

grant delete on table "public"."Models" to "service_role";

grant insert on table "public"."Models" to "service_role";

grant references on table "public"."Models" to "service_role";

grant select on table "public"."Models" to "service_role";

grant trigger on table "public"."Models" to "service_role";

grant truncate on table "public"."Models" to "service_role";

grant update on table "public"."Models" to "service_role";

grant delete on table "public"."OpenAIKeys" to "anon";

grant insert on table "public"."OpenAIKeys" to "anon";

grant references on table "public"."OpenAIKeys" to "anon";

grant select on table "public"."OpenAIKeys" to "anon";

grant trigger on table "public"."OpenAIKeys" to "anon";

grant truncate on table "public"."OpenAIKeys" to "anon";

grant update on table "public"."OpenAIKeys" to "anon";

grant delete on table "public"."OpenAIKeys" to "authenticated";

grant insert on table "public"."OpenAIKeys" to "authenticated";

grant references on table "public"."OpenAIKeys" to "authenticated";

grant select on table "public"."OpenAIKeys" to "authenticated";

grant trigger on table "public"."OpenAIKeys" to "authenticated";

grant truncate on table "public"."OpenAIKeys" to "authenticated";

grant update on table "public"."OpenAIKeys" to "authenticated";

grant delete on table "public"."OpenAIKeys" to "service_role";

grant insert on table "public"."OpenAIKeys" to "service_role";

grant references on table "public"."OpenAIKeys" to "service_role";

grant select on table "public"."OpenAIKeys" to "service_role";

grant trigger on table "public"."OpenAIKeys" to "service_role";

grant truncate on table "public"."OpenAIKeys" to "service_role";

grant update on table "public"."OpenAIKeys" to "service_role";

grant delete on table "public"."Projects" to "anon";

grant insert on table "public"."Projects" to "anon";

grant references on table "public"."Projects" to "anon";

grant select on table "public"."Projects" to "anon";

grant trigger on table "public"."Projects" to "anon";

grant truncate on table "public"."Projects" to "anon";

grant update on table "public"."Projects" to "anon";

grant delete on table "public"."Projects" to "authenticated";

grant insert on table "public"."Projects" to "authenticated";

grant references on table "public"."Projects" to "authenticated";

grant select on table "public"."Projects" to "authenticated";

grant trigger on table "public"."Projects" to "authenticated";

grant truncate on table "public"."Projects" to "authenticated";

grant update on table "public"."Projects" to "authenticated";

grant delete on table "public"."Projects" to "service_role";

grant insert on table "public"."Projects" to "service_role";

grant references on table "public"."Projects" to "service_role";

grant select on table "public"."Projects" to "service_role";

grant trigger on table "public"."Projects" to "service_role";

grant truncate on table "public"."Projects" to "service_role";

grant update on table "public"."Projects" to "service_role";

grant delete on table "public"."Prompts" to "anon";

grant insert on table "public"."Prompts" to "anon";

grant references on table "public"."Prompts" to "anon";

grant select on table "public"."Prompts" to "anon";

grant trigger on table "public"."Prompts" to "anon";

grant truncate on table "public"."Prompts" to "anon";

grant update on table "public"."Prompts" to "anon";

grant delete on table "public"."Prompts" to "authenticated";

grant insert on table "public"."Prompts" to "authenticated";

grant references on table "public"."Prompts" to "authenticated";

grant select on table "public"."Prompts" to "authenticated";

grant trigger on table "public"."Prompts" to "authenticated";

grant truncate on table "public"."Prompts" to "authenticated";

grant update on table "public"."Prompts" to "authenticated";

grant delete on table "public"."Prompts" to "service_role";

grant insert on table "public"."Prompts" to "service_role";

grant references on table "public"."Prompts" to "service_role";

grant select on table "public"."Prompts" to "service_role";

grant trigger on table "public"."Prompts" to "service_role";

grant truncate on table "public"."Prompts" to "service_role";

grant update on table "public"."Prompts" to "service_role";

grant delete on table "public"."Users" to "anon";

grant insert on table "public"."Users" to "anon";

grant references on table "public"."Users" to "anon";

grant select on table "public"."Users" to "anon";

grant trigger on table "public"."Users" to "anon";

grant truncate on table "public"."Users" to "anon";

grant update on table "public"."Users" to "anon";

grant delete on table "public"."Users" to "authenticated";

grant insert on table "public"."Users" to "authenticated";

grant references on table "public"."Users" to "authenticated";

grant select on table "public"."Users" to "authenticated";

grant trigger on table "public"."Users" to "authenticated";

grant truncate on table "public"."Users" to "authenticated";

grant update on table "public"."Users" to "authenticated";

grant delete on table "public"."Users" to "service_role";

grant insert on table "public"."Users" to "service_role";

grant references on table "public"."Users" to "service_role";

grant select on table "public"."Users" to "service_role";

grant trigger on table "public"."Users" to "service_role";

grant truncate on table "public"."Users" to "service_role";

grant update on table "public"."Users" to "service_role";


