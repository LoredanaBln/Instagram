import type {RelationshipDTO} from "~/services/dtos/relationship_dto";

/**
 * private String username;
 *   private UserType role;
 *   private boolean authenticated;
 */
export interface AuthenticateResponse {
    username: string;
    role: string;
}

