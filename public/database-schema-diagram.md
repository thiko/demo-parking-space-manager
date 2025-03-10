```mermaid
erDiagram
    USERS ||--o{ RESERVATIONS : "creates"
    
    USERS {
        uuid id PK
        string email
        string encrypted_password
        timestamp created_at
        timestamp last_sign_in
        boolean confirmed
    }
    
    RESERVATIONS {
        uuid id PK
        uuid user_id FK
        timestamp start_time
        timestamp end_time
        string description
        timestamp created_at
    }
    
    %% Constraints
    RESERVATIONS }|--|| CONSTRAINTS : "subject to"
    
    CONSTRAINTS {
        check start_before_end "start_time < end_time"
        trigger check_reservation_overlap "No overlaps"
    }
    
    %% Policies
    RESERVATIONS }|--|| ROW_LEVEL_SECURITY : "protected by"
    
    ROW_LEVEL_SECURITY {
        policy select_all "All can view"
        policy insert_own "Only create own"
        policy update_own "Only update own"
        policy delete_own "Only delete own"
    }
``` 