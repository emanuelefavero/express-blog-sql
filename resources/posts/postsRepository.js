import { db } from '#/db/db.js';

const SORT_COLUMNS = {
  id: 'posts.id',
  title: 'posts.title',
};

const SORT_ORDERS = {
  asc: 'ASC',
  desc: 'DESC',
};

/**
 * Finds tags associated with the given post IDs.
 *
 * @param {number[]} postIds
 * @returns {Promise<Map<number, string[]>>} A map of post IDs and tag arrays
 * @example
 * { 1: ['tag1', 'tag2'], 2: [] } // return value
 */
const findTagsByPostIds = async (postIds) => {
  const placeholders = postIds.map(() => '?').join(', ');

  const [tagRows] = await db.query(
    `
      SELECT post_tag.post_id, tags.label
      FROM post_tag
      INNER JOIN tags
        ON tags.id = post_tag.tag_id
      WHERE post_tag.post_id IN (${placeholders})
      ORDER BY post_tag.post_id, tags.id
    `,
    postIds,
  );

  const tagsByPostId = new Map(postIds.map((postId) => [postId, []]));

  for (const tag of tagRows) {
    tagsByPostId.get(tag.post_id).push(tag.label);
  }

  return tagsByPostId;
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

  if (posts.length === 0) return [];

  const postIds = posts.map((post) => post.id);
  const tagsByPostId = await findTagsByPostIds(postIds);

  return posts.map((post) => ({
    ...post,
    tags: tagsByPostId.get(post.id),
  }));
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

export const update = async (id, postData) => {
  const postId = Number(id);
  const { title, content, image, tags } = postData;
  const uniqueTags = [...new Set(tags)];

  const connection = await db.getConnection();

  try {
    await connection.query('START TRANSACTION');

    const [postResult] = await connection.query(
      `
        UPDATE posts
        SET title = ?, content = ?, image = ?
        WHERE id = ?
      `,
      [title, content, image, postId],
    );

    if (postResult.affectedRows === 0) {
      await connection.query('ROLLBACK');
      return null;
    }

    await connection.query('DELETE FROM post_tag WHERE post_id = ?', [postId]);

    for (const label of uniqueTags) {
      const [tagResult] = await connection.query(
        `
          INSERT INTO tags (label)
          VALUES (?)
          ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)
        `,
        [label],
      );

      await connection.query(
        'INSERT INTO post_tag (post_id, tag_id) VALUES (?, ?)',
        [postId, tagResult.insertId],
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

export const destroy = async (id) => {
  const [result] = await db.query('DELETE FROM posts WHERE id = ?', [
    Number(id),
  ]);

  return result.affectedRows > 0;
};
