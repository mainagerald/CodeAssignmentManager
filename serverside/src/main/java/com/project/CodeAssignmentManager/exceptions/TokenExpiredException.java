package com.project.CodeAssignmentManager.exceptions;

public class TokenExpiredException extends RuntimeException{
    public TokenExpiredException(String message){
        super(message);
    }
}
