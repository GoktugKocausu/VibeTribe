package com.example.vibetribesdemo.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {
    
    @GetMapping(value = {
        "/",
        "/login",
        "/register",
        "/profile/**",
        "/friends",
        "/notifications",
        "/create-event",
        "/event/**",
        "/users",
        "/hobby-selection",
        "/admin/**"
    })
    public String forward() {
        return "forward:/index.html";
    }
} 