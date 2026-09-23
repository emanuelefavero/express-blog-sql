import path from 'node:path';
import { db } from '#/db/db.js';
import { readJsonFile, writeJsonFile } from '#/utils/json.js';

const postsFilePath = path.join(import.meta.dirname, '../../data/posts.json');

const readPosts = () => readJsonFile(postsFilePath);

const SORT_COLUMNS = {
  id: 'posts.id',
  title: 'posts.title',
};

const SORT_ORDERS = {
  asc: 'ASC',
  desc: 'DESC',
};

// REPOSITORY
export const count = async () => {
  const [result] = await db.query('SELECT COUNT(*) AS count FROM posts');
  return result[0].count;
};

export const findAll = async ({
  tag,
  search,
  sortBy,
  order = 'asc',
  _limit,
} = {}) => {
  const conditions = [];
  const values = [];

  let sql = `
    SELECT DISTINCT posts.*
    FROM posts
  `;

  if (tag) {
    sql += `
      INNER JOIN post_tag
        ON post_tag.post_id = posts.id
      INNER JOIN tags
        ON tags.id = post_tag.tag_id
    `;

    conditions.push('LOWER(tags.label) = LOWER(?)');
    values.push(tag);
  }

  if (search) {
    conditions.push(
      '(LOWER(posts.title) LIKE LOWER(?) OR LOWER(posts.content) LIKE LOWER(?))',
    );
    const searchPattern = `%${search}%`;
    values.push(searchPattern, searchPattern);
  }

  if (conditions.length > 0) {
    sql += ` WHERE ${conditions.join(' AND ')}`;
  }

  if (sortBy && SORT_COLUMNS[sortBy]) {
    sql += ` ORDER BY ${SORT_COLUMNS[sortBy]} ${SORT_ORDERS[order] || 'ASC'}`;
  }

  if (_limit) {
    sql += ' LIMIT ?';
    values.push(Number(_limit));
  }

  const [posts] = await db.query(sql, values);

  return posts;
};

export const findById = async (id) => {
  const postSql = `
    SELECT * FROM posts
    WHERE id = ?;
  `;

  const [[post]] = await db.query(postSql, [Number(id)]);

  if (!post) return null;

  const tagsSql = `
    SELECT tags.label
    FROM tags
    INNER JOIN post_tag
      ON post_tag.tag_id = tags.id
    WHERE post_tag.post_id = ?
    ORDER BY tags.id;
  `;

  const [tagRows] = await db.query(tagsSql, [Number(id)]);

  const tags = tagRows.map((tag) => tag.label);

  return { ...post, tags };
};

export const create = async (postData) => {
  const { title, content, image, tags } = postData;
  const uniqueTags = [...new Set(tags)];

  const connection = await db.getConnection();

  try {
    await connection.query('START TRANSACTION');

    const [postResult] = await connection.query(
      `
        INSERT INTO posts (title, content, image) 
        VALUES (?, ?, ?)
      `,
      [title, content, image],
    );

    const postId = postResult.insertId;

    for (const label of uniqueTags) {
      const [tagResult] = await connection.query(
        `
          INSERT INTO tags (label) 
          VALUES (?) 
          ON DUPLICATE KEY UPDATE id = 
          LAST_INSERT_ID(id)
        `,
        [label],
      );

      const tagId = tagResult.insertId;

      await connection.query(
        `
        INSERT INTO post_tag (post_id, tag_id) VALUES (?, ?)
        `,
        [postId, tagId],
      );
    }

    await connection.query('COMMIT');

    return {
      id: postId,
      title,
      content,
      image,
      tags: uniqueTags,
    };
  } catch (error) {
    await connection.query('ROLLBACK');
    throw error;
  } finally {
    connection.release();
  }
};

export const update = (id, postData) => {
  const posts = readPosts();
  const postIndex = posts.findIndex((post) => post.id === id);

  if (postIndex === -1) return null;

  const updatedPost = { id, ...postData };
  posts[postIndex] = updatedPost;

  writeJsonFile(postsFilePath, posts);

  return updatedPost;
};

export const destroy = (id) => {
  const posts = readPosts();
  const postIndex = posts.findIndex((post) => post.id === id);

  if (postIndex === -1) return null;

  const [destroyedPost] = posts.splice(postIndex, 1);

  writeJsonFile(postsFilePath, posts);

  return destroyedPost;
};
