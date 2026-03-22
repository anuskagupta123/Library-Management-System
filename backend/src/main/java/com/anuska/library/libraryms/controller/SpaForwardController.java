package com.anuska.library.libraryms.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaForwardController {

    @GetMapping({
            "/login",
            "/register",
            "/books",
            "/my-books",
            "/dashboard",
            "/admin",
            "/admin/users",
            "/add-book"
    })
    public String forwardToIndex() {
        return "forward:/index.html";
    }
}
