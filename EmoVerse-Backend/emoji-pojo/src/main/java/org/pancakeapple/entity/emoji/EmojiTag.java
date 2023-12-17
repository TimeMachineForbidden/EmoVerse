package org.pancakeapple.entity.emoji;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Emoji与Tag的多对多关系
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmojiTag {
    private Integer id;
    private Long emojiId;  //表情包id
    private Long tagId;  //标签id

    private LocalDateTime createTime;
    private Long createUser;
    private LocalDateTime updateTime;
    private Long updateUser;
}
