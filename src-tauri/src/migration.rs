use tauri_plugin_sql::{Migration, MigrationKind};

pub fn get_migrations() -> Vec<Migration> {
    vec![
        Migration {
            version: 1,
            description: "create_initial_tables",
            sql: r###"
            CREATE TABLE "Projects" (
                "id"	TEXT NOT NULL UNIQUE,
                "created_at"	TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "name"	TEXT NOT NULL,
                "description"	TEXT,
                "link"	TEXT,
                "time"	INTEGER NOT NULL DEFAULT 0,
                "tasks_count"	INTEGER NOT NULL DEFAULT 0,
                PRIMARY KEY("id")
            );
            
            CREATE TABLE "Tasks" (
                "id"	TEXT NOT NULL UNIQUE,
                "created_at"	TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "name"	TEXT NOT NULL,
                "description"	TEXT,
                "link"	TEXT,
                "time"	INTEGER NOT NULL DEFAULT 0,
                "project"	TEXT NOT NULL,
                PRIMARY KEY("id"),
                FOREIGN KEY("project") REFERENCES "Projects"("id")
            );
            "###,
            kind: MigrationKind::Up,
        },
        Migration {
            version: 2,
            description: "cascade_tasks_on_projects_delete",
            sql: r###"
                -- Drop the Tasks table but keep the data
                CREATE TABLE "Tasks_temp" AS SELECT * FROM "Tasks";
                DROP TABLE "Tasks";
                
                -- Recreate Tasks table with CASCADE constraint
                CREATE TABLE "Tasks" (
                    "id"	TEXT NOT NULL UNIQUE,
                    "created_at"	TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    "name"	TEXT NOT NULL,
                    "description"	TEXT,
                    "link"	TEXT,
                    "time"	INTEGER NOT NULL DEFAULT 0,
                    "project"	TEXT NOT NULL,
                    PRIMARY KEY("id"),
                    FOREIGN KEY("project") REFERENCES "Projects"("id") ON DELETE CASCADE
                );
                
                -- Restore the data
                INSERT INTO "Tasks" SELECT * FROM "Tasks_temp";
                DROP TABLE "Tasks_temp";
                "###,
            kind: MigrationKind::Up,
        },
    ]
}
