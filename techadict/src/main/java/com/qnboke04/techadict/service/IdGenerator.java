package com.qnboke04.techadict.service;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class IdGenerator {
    public String generate(String prefix){
        String time = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        int random = ThreadLocalRandom.current().nextInt(100, 999);
        return String.format("%s-%s-%d", prefix, time, random);
    }
}
